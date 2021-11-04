import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from './models/endorsement.model'
import { EndorsementController } from './endorsement.controller'
import { EndorsementService } from './endorsement.service'
import { EndorsementMetadataModule } from '../endorsementMetadata/endorsementMetadata.module'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementValidatorModule } from '../endorsementValidator/endorsementValidator.module'
import { EndorsementListService } from '../endorsementList/endorsementList.service'
import { EmailModule } from '@island.is/email-service'
import { environment } from '../../../environments'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement, EndorsementList]),
    EndorsementMetadataModule,
    EndorsementValidatorModule,
    EmailModule.register({
      useTestAccount: true,
      useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
    }),
  ],
  controllers: [EndorsementController],
  providers: [
    EndorsementService,
    EndorsementListService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instanciateClass(
          environment.endorsementListProvider
            .nationalRegistry as NationalRegistryConfig,
        ),
    },
  ],
})
export class EndorsementModule {}
