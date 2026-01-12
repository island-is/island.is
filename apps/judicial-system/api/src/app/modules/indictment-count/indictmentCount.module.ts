import { Module } from '@nestjs/common'

import { IndictmentCountResolver } from './indictmentCount.resolver'
import { OffenseResolver } from './offense.resolver'

@Module({
  providers: [IndictmentCountResolver, OffenseResolver],
})
export class IndictmentCountModule {}
