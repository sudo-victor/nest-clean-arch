import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: new UniqueEntityID('2').toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
