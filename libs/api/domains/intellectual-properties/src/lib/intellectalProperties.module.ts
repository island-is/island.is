import { Module } from '@nestjs/common'
import { IntellectualPropertiesClientModule } from '@island.is/clients/intellectual-properties'
import { IntellectualPropertiesService } from './intellectualProperties.service'
import { IntellectualPropertiesResolver } from './intellectualProperties.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
@Module({
  imports: [IntellectualPropertiesClientModule, FeatureFlagModule],
  providers: [
    IntellectualPropertiesClientModule,
    IntellectualPropertiesService,
    IntellectualPropertiesResolver,
  ],
  exports: [IntellectualPropertiesService],
})
export class IntellectualPropertiesModule {}
