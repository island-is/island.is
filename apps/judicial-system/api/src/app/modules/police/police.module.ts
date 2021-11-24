import { Module } from '@nestjs/common'

import { PoliceResolver } from './police.resolver'

@Module({
  providers: [PoliceResolver],
})
export class PoliceModule {}
