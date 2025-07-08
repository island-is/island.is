import { Module } from '@nestjs/common'

import { VerdictResolver } from './verdict.resolver'

@Module({
  providers: [VerdictResolver],
})
export class VerdictModule {}
