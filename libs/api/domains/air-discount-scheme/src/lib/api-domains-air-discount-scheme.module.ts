import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'

import { DiscountResolver } from './discount/discount.resolver'
import { DiscountService } from './discount/discount.service'
import { DiscountAdminResolver } from './discount-admin/discount-admin.resolver'
import { DiscountAdminService } from './discount-admin/discount-admin.service'
import { FlightLegAdminResolver } from './flight-leg-admin/flight-leg-admin.resolver'
import { FlightLegAdminService } from './flight-leg-admin/flight-leg-admin.service'
import { FlightLegResolver } from './flight-leg/flight-leg.resolver'
import { FlightLegService } from './flight-leg/flight-leg.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  providers: [
    DiscountResolver,
    DiscountService,
    FlightLegAdminResolver,
    FlightLegAdminService,
    FlightLegResolver,
    FlightLegService,
    DiscountAdminResolver,
    DiscountAdminService,
  ],
  imports: [AirDiscountSchemeClientModule, AuthModule, FeatureFlagModule],
  exports: [],
})
export class AirDiscountSchemeModule {}
