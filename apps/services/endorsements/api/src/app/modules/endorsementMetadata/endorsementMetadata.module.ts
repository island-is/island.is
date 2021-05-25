import { Module } from '@nestjs/common'
import { EndorsementMetadataService } from './endorsementMetadata.service'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { NationalRegistryUserService } from './providers/nationalRegistryUser.service'
import { environment } from '../../../environments/environment'
import { NationalRegistryApiMock } from './providers/mock/nationalRegistryApiMock'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from '../endorsement/endorsement.model'
import { EndorsementSystemSignedListsService } from './providers/endorsementSystemSignedLists.service'

@Module({
  imports: [SequelizeModule.forFeature([Endorsement])],
  providers: [
    NationalRegistryUserService,
    EndorsementSystemSignedListsService,
    EndorsementMetadataService,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instanciateClass(
          environment.metadataProviser
            .nationalRegistry as NationalRegistryConfig,
        ),
      // This exists cause mocking soap with msw is out of scope for this project
      ...(environment.apiMock
        ? { useValue: new NationalRegistryApiMock() }
        : {}),
    },
  ],
  exports: [EndorsementMetadataService],
})
export class EndorsementMetadataModule {}
