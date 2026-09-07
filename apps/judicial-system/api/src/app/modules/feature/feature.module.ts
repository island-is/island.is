import { Module } from '@nestjs/common'

import { FeatureController } from './feature.controller'
import { FeatureService } from './feature.service'

@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
