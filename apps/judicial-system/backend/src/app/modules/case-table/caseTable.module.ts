import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Case } from '../case/models/case.model'
import { CaseTableController } from './caseTable.controller'
import { CaseTableService } from './caseTable.service'

@Module({
  imports: [SequelizeModule.forFeature([Case])],
  providers: [CaseTableService],
  controllers: [CaseTableController],
})
export class CaseTableModule {}
