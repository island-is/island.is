import { Module } from '@nestjs/common'

import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { VehiclesResolver } from './api-domains-vehicles.resolver'
import { VehiclesMileageResolver } from './api-domains-vehicles-mileage.resolver'
import { VehiclesService } from './api-domains-vehicles.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { VehiclesSharedResolver } from './api-domains-vehicles-shared.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  providers: [
    VehiclesResolver,
    VehiclesSharedResolver,
    VehiclesMileageResolver,
    VehiclesService,
  ],
  imports: [
    VehiclesClientModule,
    VehiclesMileageClientModule,
    AuthModule,
    FeatureFlagModule,
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
