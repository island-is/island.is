import { Module } from '@nestjs/common'
import { IntellectualPropertiesClientModule } from '@island.is/clients/intellectual-properties'
import { IntellectualPropertiesService } from './intellectualProperties.service'
@Module({
  providers: [IntellectualPropertiesClientModule],
  exports: [IntellectualPropertiesService],
})
export class IntellectualPropertiesModule {}
