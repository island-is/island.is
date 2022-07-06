import { Module } from '@nestjs/common'

import { DefendantResolver } from './defendant.resolver'

@Module({
  providers: [DefendantResolver],
})
export class DefendantModule {}
