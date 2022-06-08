import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { environment } from '../../../environments'
import { DraftRegulationService } from './draft_regulation.service'
import { DraftRegulationController } from './draft_regulation.controller'
import { DraftRegulationModel } from './draft_regulation.model'
import { DraftRegulationChangeModule } from '../draft_regulation_change'
import { DraftRegulationCancelModule } from '../draft_regulation_cancel'
import { RegulationsService } from '@island.is/clients/regulations'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { DraftAuthorModule } from '../draft_author'

@Module({
  imports: [
    SequelizeModule.forFeature([DraftRegulationModel]),
    DraftAuthorModule,
    DraftRegulationChangeModule,
    DraftRegulationCancelModule,
  ],
  providers: [
    DraftRegulationService,
    {
      provide: RegulationsService,
      useFactory: async () =>
        new RegulationsService({ url: environment.regulationsApiUrl }),
    },
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        await NationalRegistryApi.instantiateClass(
          environment.nationalRegistry,
        ),
    },
  ],
  controllers: [DraftRegulationController],
  exports: [DraftRegulationService, RegulationsService],
})
export class DraftRegulationModule {}
