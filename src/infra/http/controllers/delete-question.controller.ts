import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/usecases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const authorId = user.sub

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
