import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseListService } from './caseList.service'
import { CaseListEntry } from './caseList.model'
import { DefendantModule } from '../defendant/defendant.module'
import { UserModule } from '../user/user.module'
import { CaseListController } from './caseList.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([CaseListEntry]),
    forwardRef(() => DefendantModule),
    forwardRef(() => UserModule),
  ],
  providers: [CaseListService],
  controllers: [CaseListController],
  exports: [CaseListService],
})
export class CaseListModule {}
