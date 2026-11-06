import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { DiscountResolver } from './discount/discount.resolver'
import { DiscountService } from './discount/discount.service'
import { DiscountAdminResolver } from './discount-admin/discount-admin.resolver'
import { DiscountAdminService } from './discount-admin/discount-admin.service'
import { FlightLegResolver } from './flight-leg/flight-leg.resolver'
import { FlightLegService } from './flight-leg/flight-leg.service'
import { FlightLegAdminResolver } from './flight-leg-admin/flight-leg-admin.resolver'
import { FlightLegAdminService } from './flight-leg-admin/flight-leg-admin.service'
import { MemberResolver } from './member/member.resolver'
import { MemberService } from './member/member.service'
import { UsedFlightLegsLoader } from './member/usedFlightLegs.loader'

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
    MemberResolver,
    MemberService,
    UsedFlightLegsLoader,
  ],
  imports: [AirDiscountSchemeClientModule, AuthModule, FeatureFlagModule],
})
export class AirDiscountSchemeModule {}
