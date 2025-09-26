import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { Module } from '@nestjs/common'
import { VMSTApplicationsResolver } from './vmst-applications-resolver'
import { VMSTApplicationsService } from './vmst-applications-service'

@Module({
  imports: [VmstUnemploymentClientModule],
  providers: [VMSTApplicationsResolver, VMSTApplicationsService],
})
export class VmstApplicationsModule {}
