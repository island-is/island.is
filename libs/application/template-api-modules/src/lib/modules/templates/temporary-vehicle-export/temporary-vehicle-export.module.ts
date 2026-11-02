import { Module } from '@nestjs/common'
import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
import { RskKilometragjaldReimbursementClientModule } from '@island.is/clients/rsk/kilometragjald-reimbursement'
import { SharedTemplateAPIModule } from '../../shared'
import { TemporaryVehicleExportService } from './temporary-vehicle-export.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    RskKilometragjaldReimbursementClientModule,
  ],
  providers: [TemporaryVehicleExportService],
  exports: [TemporaryVehicleExportService],
})
export class TemporaryVehicleExportModule {}
