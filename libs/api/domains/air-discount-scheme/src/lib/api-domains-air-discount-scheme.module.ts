import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'

import { DiscountResolver } from './discount/discount.resolver'
import { DiscountService } from './discount/discount.service'
import { FlightLegAdminResolver } from './flight-leg-admin/flight-leg-admin.resolver'
import { FlightLegAdminService } from './flight-leg-admin/flight-leg-admin.service'

@Module({
  providers: [
    DiscountResolver,
    DiscountService,
    FlightLegAdminResolver,
    FlightLegAdminService,
  ],
  imports: [AirDiscountSchemeClientModule, AuthModule],
  exports: [],
})
export class AirDiscountSchemeModule {}
