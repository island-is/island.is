import { Module } from '@nestjs/common'

import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { AuthModule } from '@island.is/auth-nest-tools'
import { VehiclesMileageResolver } from './resolvers/api-domains-vehicles-mileage.resolver'
import { VehiclesSharedResolver } from './resolvers/api-domains-vehicles-shared.resolver'
import { VehiclesResolver } from './resolvers/api-domains-vehicles.resolver'
import { VehiclesService } from './services/api-domains-vehicles.service'
import { VehicleMileageBulkCollectionResolver } from './resolvers/vehicleMileageBulkCollection.resolver'
import { BulkMileageService } from './services/bulkMileage.service'

@Module({
  providers: [
    VehiclesResolver,
    VehiclesSharedResolver,
    VehiclesMileageResolver,
    VehiclesService,
    BulkMileageService,
    VehicleMileageBulkCollectionResolver,
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
