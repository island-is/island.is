import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Session } from './session.model'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
  imports: [SequelizeModule.forFeature([Session])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
