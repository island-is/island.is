import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseListService } from './caseList.service'
import { CaseListEntry } from './caseList.model'
import { DefendantModule } from '../defendant/defendant.module'

@Module({
  imports: [
    SequelizeModule.forFeature([CaseListEntry]),
    forwardRef(() => DefendantModule),
  ],
  providers: [CaseListService],
  controllers: [],
  exports: [CaseListService],
})
export class CaseListModule {}
