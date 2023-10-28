import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<Answer> {
    const data = PrismaAnswerMapper.toPersistence(answer)
    const answerPersisted = await this.prisma.answer.create({
      data,
    })

    return PrismaAnswerMapper.toDomain(answerPersisted)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)
    await this.prisma.answer.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({ where: { id: answer.id.toString() } })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findFirst({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }
}
