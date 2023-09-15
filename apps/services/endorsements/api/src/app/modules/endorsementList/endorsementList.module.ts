import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { Endorsement } from '../endorsement/models/endorsement.model'

import { environment } from '../../../environments'
import { EmailModule } from '@island.is/email-service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    NationalRegistryClientModule,
    SequelizeModule.forFeature([EndorsementList, Endorsement]),
    EmailModule.register(environment.emailOptions),
  ],
  controllers: [EndorsementListController],
  providers: [EndorsementListService],
  exports: [EndorsementListService],
})
export class EndorsementListModule {}
