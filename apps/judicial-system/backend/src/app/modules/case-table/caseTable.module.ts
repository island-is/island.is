import { Module } from '@nestjs/common'

import { CaseTableController } from './caseTable.controller'

@Module({ controllers: [CaseTableController] })
export class CaseTableModule {}
