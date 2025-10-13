import { Module } from '@nestjs/common'
import { HmsModule } from '@island.is/clients/hms'
import { HmsResolver } from './api-domains-hms.resolver'

@Module({
  imports: [HmsModule],
  providers: [HmsResolver],
})
export class ApiDomainsHmsModule {}
