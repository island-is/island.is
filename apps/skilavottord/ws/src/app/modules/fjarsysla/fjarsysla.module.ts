import { HttpModule,Module } from '@nestjs/common'

import { FjarsyslaResolver } from './fjarsysla.resolver'
import { FjarsyslaService } from './fjarsysla.service'

@Module({
  imports: [HttpModule],
  providers: [FjarsyslaResolver, FjarsyslaService],
  exports: [FjarsyslaService],
})
export class FjarsyslaModule {}
