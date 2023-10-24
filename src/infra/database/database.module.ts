import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments.repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-questions-comments.repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
