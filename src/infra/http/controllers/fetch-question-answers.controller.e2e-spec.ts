import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Fetch question answers (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    await Promise.all([
      answerFactory.makePrismaAnswer({
        content: 'Answer 01',
        authorId: user.id,
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        content: 'Answer 02',
        authorId: user.id,
        questionId: question.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer 01' }),
        expect.objectContaining({ content: 'Answer 02' }),
      ]),
    })
  })
})
