import { Module } from '@nestjs/common'

import { VictimResolver } from './victim.resolver'

@Module({
  providers: [VictimResolver],
})
export class VictimModule {}
