import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { SyslumennService } from './syslumennClient.service'

@Module({
  imports: [FeatureFlagModule],
  providers: [SyslumennService],
  exports: [SyslumennService],
})
export class SyslumennClientModule {}
