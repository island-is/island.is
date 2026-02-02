import { Module } from '@nestjs/common'
import { HmsModule } from '@island.is/clients/hms'
import { HmsResolver } from './resolvers/api-domains-hms.resolver'
import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'
import { RentalAgreementsResolver } from './resolvers/rentalAgreements.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [FeatureFlagModule, HmsModule, HmsRentalAgreementClientModule],
  providers: [HmsResolver, RentalAgreementsResolver],
})
export class ApiDomainsHmsModule {}
