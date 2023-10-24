import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/infra/auth/auth.module'
import { HttpModule } from '@/infra/http/http.module'
import { EnvModule } from './env/env.module'
import { envSchema } from './env/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (obj) => envSchema.parse(obj),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
