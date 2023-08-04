import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { Module } from '@nestjs/common'
import { HealthDirectorateResolver } from './healthDirectorate.resolver'

@Module({
  imports: [HealthDirectorateClientModule],
  providers: [HealthDirectorateResolver],
})
export class HealthDirectorateModule {}
