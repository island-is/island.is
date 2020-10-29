import { Module, HttpModule } from '@nestjs/common'
import { SamgongustofaService } from './models/samgongustofa.service'
import { SamgongustofaResolver } from './samgongustofa.resolver'

@Module({
  imports: [HttpModule],
  providers: [SamgongustofaResolver, SamgongustofaService],
})
export class SamgongustofaModule {}
