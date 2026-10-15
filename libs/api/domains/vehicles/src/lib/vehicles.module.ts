import { Module } from '@nestjs/common'

import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { RskKilometerFeeClientModule } from '@island.is/clients/rsk/kilometer-fee'
import { VehiclesResolver } from './resolvers/vehicles.resolver'
import { VehiclesMileageResolver } from './resolvers/mileage.resolver'
import { VehiclesService } from './services/vehicles.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { BulkMileageService } from './services/bulkMileage.service'
import { VehiclesV3Resolver } from './resolvers/vehicleV3.resolver'
import { VehiclesBulkMileageResolver } from './resolvers/bulkMileage.resolver'
import { VehiclesMileageFeeResolver } from './resolvers/mileageFee.resolver'
import { MileageFeeService } from './services/mileageFee.service'
import { FileStorageModule } from '@island.is/file-storage'
import { CmsTranslationsModule } from '@island.is/cms-translations'

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
