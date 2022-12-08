import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './models/endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListService } from '../endorsementList/endorsementList.service'
import { environment } from '../../../environments'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { EmailModule } from '@island.is/email-service'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EmailModule.register(environment.emailOptions),
  ],
  controllers: [EndorsementController],
  providers: [
    EndorsementService,
    EndorsementListService,
    {
      provide: NationalRegistryApi,
      // See method doc for disable reason.
      // eslint-disable-next-line local-rules/no-async-module-init
      useFactory: async () =>
        NationalRegistryApi.instantiateClass(environment.nationalRegistry),
    },
  ],
})
export class EndorsementModule {}
