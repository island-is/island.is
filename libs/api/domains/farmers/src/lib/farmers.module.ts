import { Module } from '@nestjs/common'
import { FarmersResolver } from './farmers.resolver'
import { FarmersService } from './farmers.service'
import { FarmersClientModule } from '@island.is/clients/farmers'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [FarmersClientModule, FeatureFlagModule],
  providers: [FarmersResolver, FarmersService],
  exports: [FarmersService],
})
export class FarmersModule {}
