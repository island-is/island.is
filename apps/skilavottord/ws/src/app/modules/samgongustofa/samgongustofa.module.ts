import { Module, HttpModule } from '@nestjs/common'

import { RecyclingRequestModule } from '../recycling.request'
import { SamgongustofaService } from './samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'

@Module({
  imports: [HttpModule, RecyclingRequestModule],
  providers: [SamgongustofaResolver, SamgongustofaService],
})
export class SamgongustofaModule {}
