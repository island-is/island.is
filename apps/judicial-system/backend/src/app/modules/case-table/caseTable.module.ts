import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from '../repository'
import { CaseTableController } from './caseTable.controller'
import { CaseTableService } from './caseTable.service'

@Module({
  imports: [SequelizeModule.forFeature([Case])],
  providers: [CaseTableService],
  controllers: [CaseTableController],
})
export class CaseTableModule {}
