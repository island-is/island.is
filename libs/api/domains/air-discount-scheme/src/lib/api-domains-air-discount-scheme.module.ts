import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientModule } from '@island.is/clients/air-discount-scheme'

import { AirDiscountSchemeResolver } from './api-domains-air-discount-scheme.resolver'
import { AirDiscountSchemeService } from './api-domains-air-discount-scheme.service'

@Module({
  providers: [AirDiscountSchemeResolver, AirDiscountSchemeService],
  imports: [AirDiscountSchemeClientModule, AuthModule],
  exports: [AirDiscountSchemeService],
})
export class AirDiscountSchemeModule {}
