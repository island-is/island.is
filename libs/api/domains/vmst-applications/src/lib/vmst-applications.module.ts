import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { VMSTApplicationsResolver } from './vmst-applications-resolver'
import { VMSTApplicationsService } from './vmst-applications-service'

@Module({
  imports: [VmstUnemploymentClientModule, FeatureFlagModule],
  providers: [VMSTApplicationsResolver, VMSTApplicationsService],
})
export class VmstApplicationsModule {}
