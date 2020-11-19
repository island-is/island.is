import { Module, HttpModule } from '@nestjs/common'
import { FjarsyslaService } from './models/fjarsysla.service'

@Module({
  imports: [HttpModule],
  providers: [FjarsyslaService],
  exports: [FjarsyslaService],
})
export class FjarsyslaModule {}
