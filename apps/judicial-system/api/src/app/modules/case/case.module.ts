import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '../auth'
import { Case } from './case.model'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Case])],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
