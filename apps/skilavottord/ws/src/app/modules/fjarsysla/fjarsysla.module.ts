import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { FjarsyslaService } from './models/fjarsysla.service'
import { FjarsyslaResolver } from './fjarsysla.resolver'

@Module({
  imports: [HttpModule],
  providers: [FjarsyslaResolver, FjarsyslaService],
  exports: [FjarsyslaService],
})
export class FjarsyslaModule {}
