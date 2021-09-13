import { Module } from '@nestjs/common'

import { CaseResolver } from './case.resolver'

@Module({
  providers: [CaseResolver],
})
export class CaseModule {}
