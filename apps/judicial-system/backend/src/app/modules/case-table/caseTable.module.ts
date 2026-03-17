import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, RepositoryModule } from '..'
import { CaseTableController } from './caseTable.controller'
import { CaseTableService } from './caseTable.service'

@Module({
  imports: [forwardRef(() => RepositoryModule), forwardRef(() => CaseModule)],
  providers: [CaseTableService],
  controllers: [CaseTableController],
})
export class CaseTableModule {}
