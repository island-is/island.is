import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { EmailModule } from '@island.is/email-service'

import { environment } from '../../../environments'
import { Endorsement } from '../endorsement/models/endorsement.model'

import { EndorsementListController } from './endorsementList.controller'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

@Module({
  imports: [
    SequelizeModule.forFeature([EndorsementList, Endorsement]),
    EmailModule.register(environment.emailOptions),
  ],
  controllers: [EndorsementListController],
  providers: [
    EndorsementListService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instantiateClass(
          environment.nationalRegistry,
        ),
    },
  ],
  exports: [EndorsementListService],
})
export class EndorsementListModule {}
