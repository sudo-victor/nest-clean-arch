import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return new UnauthorizedException('User credentials do not match')
    }

    const token = this.jwt.sign({ sub: user.id })

    return { access_token: token }
  }
}
