import { forwardRef,HttpModule, Module } from '@nestjs/common'

import { RecyclingRequestModule } from '../recyclingRequest/recyclingRequest.module'

import { SamgongustofaResolver } from './samgongustofa.resolver'
import { SamgongustofaService } from './samgongustofa.service'

@Module({
  imports: [HttpModule, forwardRef(() => RecyclingRequestModule)],
  providers: [SamgongustofaResolver, SamgongustofaService],
  exports: [SamgongustofaService],
})
export class SamgongustofaModule {}
