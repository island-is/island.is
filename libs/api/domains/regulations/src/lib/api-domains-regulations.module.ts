import { DynamicModule, Module } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { RegulationsResolver } from './api-domains-regulations.resolver'

@Module({
  providers: [RegulationsResolver, RegulationsService],
})
export class RegulationsModule {}
