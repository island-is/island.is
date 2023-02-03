import { Module } from '@nestjs/common'

import { IndictmentCountResolver } from './indictmentCount.resolver'

@Module({
  providers: [IndictmentCountResolver],
})
export class IndictmentCountModule {}
