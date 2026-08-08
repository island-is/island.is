import { Module } from '@nestjs/common'
import { ReiknivelarClientModule } from '@island.is/clients/rsk/reiknivelar'
import { RskCalculatorsResolver } from './rsk-calculators.resolver'
import { RskCalculatorsService } from './rsk-calculators.service'

@Module({
  imports: [ReiknivelarClientModule],
  providers: [RskCalculatorsResolver, RskCalculatorsService],
})
export class RskCalculatorsModule {}
