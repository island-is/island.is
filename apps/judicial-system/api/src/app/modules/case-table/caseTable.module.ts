import { Module } from '@nestjs/common'

import { CaseTableResolver } from './caseTable.resolver'

@Module({
  providers: [CaseTableResolver],
})
export class CaseTableModule {}
