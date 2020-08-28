import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Case } from './case.model'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [SequelizeModule.forFeature([Case])],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
