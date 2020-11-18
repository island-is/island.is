import { Module, HttpModule } from '@nestjs/common'
import { SamgongustofaService } from './models/samgongustofa.service'
import { RecyclingRequestModule } from '../recycling.request/recycling.request.module'

@Module({
  imports: [HttpModule, RecyclingRequestModule],
  providers: [SamgongustofaService],
})
export class SamgongustofaModule {}
