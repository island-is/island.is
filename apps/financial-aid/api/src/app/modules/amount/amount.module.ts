import { Module } from '@nestjs/common'

import { AmountResolver } from './Amount.resolver'
@Module({
  providers: [AmountResolver],
})
export class AmountModule {}
