import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>()
    return req.user
  },
)
