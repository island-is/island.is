import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { CarExportImportService } from './car-export-import.service'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclesClientConfig],
    }),
  ],
  providers: [CarExportImportService],
  exports: [CarExportImportService],
})
export class CarExportImportModule {}
