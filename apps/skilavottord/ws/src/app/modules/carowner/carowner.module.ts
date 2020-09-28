import { Module } from '@nestjs/common'

import { CarownerResolver } from './carowner.resolver'

@Module({
  providers: [CarownerResolver],
})
export class CarownerModule {}
