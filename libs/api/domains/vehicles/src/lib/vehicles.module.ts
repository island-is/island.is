import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { RskKilometerFeeClientModule } from '@island.is/clients/rsk/kilometer-fee'
import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FileStorageModule } from '@island.is/file-storage'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { VehiclesBulkMileageResolver } from './resolvers/bulkMileage.resolver'
import { VehiclesMileageResolver } from './resolvers/mileage.resolver'
import { VehiclesMileageFeeResolver } from './resolvers/mileageFee.resolver'
import { VehiclesResolver } from './resolvers/vehicles.resolver'
import { VehiclesV3Resolver } from './resolvers/vehicleV3.resolver'
import { BulkMileageService } from './services/bulkMileage.service'
import { MileageFeeService } from './services/mileageFee.service'
import { VehiclesService } from './services/vehicles.service'

@Module({
  providers: [
    VehiclesResolver,
    VehiclesMileageResolver,
    VehiclesBulkMileageResolver,
    VehiclesV3Resolver,
    VehiclesMileageFeeResolver,
    VehiclesService,
    BulkMileageService,
    MileageFeeService,
  ],
  imports: [
    VehiclesClientModule,
    VehiclesMileageClientModule,
    RskKilometerFeeClientModule,
    AuthModule,
    CmsTranslationsModule,
    FeatureFlagModule,
    FileStorageModule,
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
