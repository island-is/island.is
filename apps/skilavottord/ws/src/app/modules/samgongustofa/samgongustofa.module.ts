import { Module, HttpModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SamgongustofaService } from './models/samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'
import { RecyclingRequestModule } from '../recycling.request/recycling.request.module'
import { RecyclingRequestService } from '../recycling.request/recycling.request.service'

@Module({
  imports: [HttpModule, RecyclingRequestModule],
  providers: [SamgongustofaResolver, SamgongustofaService],
})
export class SamgongustofaModule {}
