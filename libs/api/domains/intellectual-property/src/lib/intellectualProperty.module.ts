import { Module } from '@nestjs/common'
import { IntellectualPropertyClientModule } from '@island.is/clients/intellectual-property'
import { IntellectualPropertyResolver } from './intellectualProperty.resolver'
import { IntellectualPropertyService } from './intellectualProperty.service'

@Module({
  imports: [IntellectualPropertyClientModule],
  providers: [IntellectualPropertyService, IntellectualPropertyResolver],
})
export class IntellectualPropertyModule {}
