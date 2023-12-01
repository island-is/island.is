import { Module } from '@nestjs/common'
import { IntellectualPropertiesClientModule } from '@island.is/clients/intellectual-properties'
import { IntellectualPropertiesService } from './intellectualProperties.service'
import { IntellectualPropertiesResolver } from './intellectualProperties.resolver'
@Module({
  imports: [IntellectualPropertiesClientModule],
  providers: [
    IntellectualPropertiesClientModule,
    IntellectualPropertiesService,
    IntellectualPropertiesResolver,
  ],
  exports: [IntellectualPropertiesService],
})
export class IntellectualPropertiesModule {}
