import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { Module } from '@nestjs/common'
import { HealthDirectorateResolver } from './health-directorate.resolver'
import { HealthDirectorateService } from './health-directorate.service'

@Module({
  imports: [HealthDirectorateClientModule],
  providers: [HealthDirectorateResolver, HealthDirectorateService],
})
export class HealthDirectorateModule {}
