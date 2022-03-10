import { Module, HttpModule, forwardRef } from '@nestjs/common'

import { RecyclingRequestModule } from '../recyclingRequest/recyclingRequest.module'

import { SamgongustofaService } from './samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'

@Module({
  imports: [HttpModule, forwardRef(() => RecyclingRequestModule)],
  providers: [SamgongustofaResolver, SamgongustofaService],
  exports: [SamgongustofaService],
})
export class SamgongustofaModule {}
