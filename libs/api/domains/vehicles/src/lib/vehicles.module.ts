import { Module } from '@nestjs/common'

import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { VehiclesResolver } from './resolvers/vehicles.resolver'
import { VehiclesMileageResolver } from './resolvers/mileage.resolver'
import { VehiclesService } from './services/vehicles.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { VehiclesSharedResolver } from './resolvers/shared.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { BulkMileageService } from './services/bulkMileage.service'

@Module({
  providers: [
    VehiclesResolver,
    VehiclesSharedResolver,
    VehiclesMileageResolver,
    VehiclesService,
    BulkMileageService,
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
