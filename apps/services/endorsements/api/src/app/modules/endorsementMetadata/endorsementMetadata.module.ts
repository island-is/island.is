import { Module } from '@nestjs/common'
import { EndorsementMetadataService } from './endorsementMetadata.service'
import { NationalRegistryService } from './providers/nationalRegistry.service'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry'
import { environment } from '../../../environments/environment'
import { NationalRegistryApiMock } from './providers/mock/nationalRegistryApiMock'

@Module({
  providers: [
    NationalRegistryService,
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
