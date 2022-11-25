import { IdsClientConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { AirDiscountSchemeApiProvider } from './AirDiscountSchemeApiProvider'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [AirDiscountSchemeApiProvider],
  exports: [AirDiscountSchemeApiProvider],
})
export class AirDiscountSchemeClientModule {}
