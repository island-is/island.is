import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { RecyclingRequestModule } from '../recyclingRequest/recyclingRequest.module'

import { SamgongustofaRestService } from './samgongustofaRest.service'
import { SamgongustofaRestResolver } from './samgongustofaRest.resolver'

@Module({})
@Module({
  imports: [HttpModule, forwardRef(() => RecyclingRequestModule)],
  providers: [SamgongustofaRestResolver, SamgongustofaRestService],
  exports: [SamgongustofaRestService],
})
export class SamgongustofaRestModule {}
