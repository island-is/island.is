import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { RecyclingRequestModule } from '../recyclingRequest/recyclingRequest.module'

import { SamgongustofaService } from './samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'
import { IcelandicTransportAuthorityModule } from '../../services/icelandicTransportAuthority.module'

@Module({
  imports: [
    HttpModule,
    forwardRef(() => RecyclingRequestModule),
    forwardRef(() => IcelandicTransportAuthorityModule),
  ],
  providers: [SamgongustofaResolver, SamgongustofaService],
  exports: [SamgongustofaService],
})
export class SamgongustofaModule {}
