import { AdministrationOfOccupationalSafetyAndHealthClientModule } from '@island.is/clients/administration-of-occupational-safety-and-health'
import { Module } from '@nestjs/common'
import { AdministrationOfOccupationalSafetyAndHealthResolver } from './administration-of-occupational-safety-and-health.resolver'

@Module({
  providers: [AdministrationOfOccupationalSafetyAndHealthResolver],
  imports: [AdministrationOfOccupationalSafetyAndHealthClientModule],
})
export class AdministrationOfOccupationalSafetyAndHealthModule {}
