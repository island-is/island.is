import { Module } from '@nestjs/common'
import { AirDiscountSchemeApiProvider } from './AirDiscountSchemeApiProvider'

@Module({
  providers: [AirDiscountSchemeApiProvider],
  exports: [AirDiscountSchemeApiProvider],
})
export class AirDiscountSchemeClientModule {}
