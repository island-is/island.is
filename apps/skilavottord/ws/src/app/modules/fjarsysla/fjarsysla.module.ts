import { Module, HttpModule } from '@nestjs/common'
import { FjarsyslaService } from './models/fjarsysla.service'
import { FjarsyslaResolver } from './fjarsysla.resolver'

@Module({
  imports: [HttpModule],
  providers: [FjarsyslaResolver, FjarsyslaService],
})
export class FjarsyslaModule {}
