import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { RecyclingRequestModule } from '../recyclingRequest/recyclingRequest.module'

import { SamgongustofaService } from './samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'
import { TransportService } from './transport/transport.service'

@Module({
  imports: [HttpModule, forwardRef(() => RecyclingRequestModule)],
  providers: [SamgongustofaResolver, SamgongustofaService, TransportService],
  exports: [SamgongustofaService],
})
export class SamgongustofaModule {}
