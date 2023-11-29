import { AdministrationOfOccupationalSafetyAndHealthClientModule } from '@island.is/clients/administration-of-occupational-safety-and-health'
import { Module } from '@nestjs/common'
import { AdministrationOfOccupationalSafetyAndHealthResolver } from './administration-of-occupational-safety-and-health.resolver'

@Module({
  controllers: [],
  providers: [AdministrationOfOccupationalSafetyAndHealthResolver],
  exports: [],
  imports: [AdministrationOfOccupationalSafetyAndHealthClientModule],
})
export class AdministrationOfOccupationalSafetyAndHealthModule {}
