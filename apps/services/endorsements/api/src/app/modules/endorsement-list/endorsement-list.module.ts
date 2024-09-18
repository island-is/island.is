import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsement-list.model'
import { EndorsementListController } from './endorsement-list.controller'
import { EndorsementListService } from './endorsement-list.service'
import { Endorsement } from '../endorsement/models/endorsement.model'

import { EmailModule } from '@island.is/email-service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'

import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    AwsModule,
    NationalRegistryV3ClientModule,
    SequelizeModule.forFeature([EndorsementList, Endorsement]),
    EmailModule,
  ],
  controllers: [EndorsementListController],
  providers: [EndorsementListService],
  exports: [EndorsementListService],
})
export class EndorsementListModule {}
