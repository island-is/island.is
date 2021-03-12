import { Module } from '@nestjs/common'

import { FeatureController } from './feature.controller'

@Module({
  controllers: [FeatureController],
})
export class FeatureModule {}
