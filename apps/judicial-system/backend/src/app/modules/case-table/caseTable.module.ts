import { forwardRef, Module } from '@nestjs/common'

import { RepositoryModule } from '..'
import { CaseTableController } from './caseTable.controller'
import { CaseTableService } from './caseTable.service'

@Module({
  imports: [forwardRef(() => RepositoryModule)],
  providers: [CaseTableService],
  controllers: [CaseTableController],
})
export class CaseTableModule {}
