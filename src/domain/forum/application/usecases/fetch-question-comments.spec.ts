import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'Jhon Doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentRepository.create(comment1)
    await inMemoryQuestionCommentRepository.create(comment2)
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await sut.execute({
      page: 1,
      questionId: 'question-id',
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Jhon Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'Jhon Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'Jhon Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'Jhon Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-id'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-id',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
