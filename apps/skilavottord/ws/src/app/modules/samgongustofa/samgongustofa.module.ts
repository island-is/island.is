import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SamgongustofaService } from './models/samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'
import { RecyclingRequestModule } from '../recycling.request/recycling.request.module'

@Module({
  imports: [HttpModule, RecyclingRequestModule],
  providers: [SamgongustofaResolver, SamgongustofaService],
})
export class SamgongustofaModule {}
