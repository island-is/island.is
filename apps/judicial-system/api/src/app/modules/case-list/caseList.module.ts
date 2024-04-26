import { Module } from '@nestjs/common'

import { CaseListResolver } from './caseList.resolver'

@Module({
  providers: [CaseListResolver],
})
export class CaseListModule {}
