import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionattachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: { id: questionattachment.attachmentId.toString() },
      data: { questionId: questionattachment.questionId.toString() },
    })

    return questionattachment
  }
}
