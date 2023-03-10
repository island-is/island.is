import { Module } from '@nestjs/common'
import { RegulationsClientModule } from '@island.is/clients/regulations'
import { RegulationsResolver } from './api-domains-regulations.resolver'

@Module({
  imports: [RegulationsClientModule],
  providers: [RegulationsResolver],
})
export class RegulationsModule {}
