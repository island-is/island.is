import { Module } from '@nestjs/common'
import { CalculatorsClientModule } from '@island.is/clients/rsk/calculators'
import { RskCalculatorsResolver } from './rsk-calculators.resolver'
import { RskCalculatorsService } from './rsk-calculators.service'

@Module({
  imports: [CalculatorsClientModule],
  providers: [RskCalculatorsResolver, RskCalculatorsService],
})
export class RskCalculatorsModule {}
