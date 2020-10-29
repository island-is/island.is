import { Module } from '@nestjs/common'
import { FjarsyslaService } from './models/fjarsysla.service'
import { FjarsyslaResolver } from './fjarsysla.resolver'

@Module({
  providers: [FjarsyslaResolver, FjarsyslaService],
})
export class FjarsyslaModule {}
