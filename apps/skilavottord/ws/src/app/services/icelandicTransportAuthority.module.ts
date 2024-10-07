import { Module, forwardRef } from '@nestjs/common'
import { IcelandicTransportAuthorityServices } from './icelandicTransportAuthority.services'
import { HttpModule } from '@nestjs/axios'
import {
  SamgongustofaModule,
  VehicleModule,
  VehicleOwnerModule,
} from '../modules'

@Module({
  imports: [
    HttpModule,
    forwardRef(() => VehicleModule),
    forwardRef(() => VehicleOwnerModule),
    forwardRef(() => SamgongustofaModule),
  ],
  providers: [IcelandicTransportAuthorityServices],
  exports: [IcelandicTransportAuthorityServices],
})
export class IcelandicTransportAuthorityModule {}
