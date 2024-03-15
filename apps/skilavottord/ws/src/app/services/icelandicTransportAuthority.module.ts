import { Module, forwardRef } from '@nestjs/common'
import { IcelandicTransportAuthorityServices } from './icelandicTransportAuthority.services'
import { HttpModule } from '@nestjs/axios'
import { VehicleModule, VehicleOwnerModule } from '../modules'

@Module({
  imports: [
    HttpModule,
    forwardRef(() => VehicleModule),
    forwardRef(() => VehicleOwnerModule),
  ],
  providers: [IcelandicTransportAuthorityServices],
  exports: [IcelandicTransportAuthorityServices],
})
export class IcelandicTransportAuthorityModule {}
