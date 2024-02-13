import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ProblemModule } from '@island.is/nest/problem'

import appModuleConfig from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appModuleConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
