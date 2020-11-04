import { Module } from '@nestjs/common'

import { AuthModule } from '../auth'
import { CaseResolver } from './case.resolver'

@Module({
  imports: [AuthModule],
  providers: [CaseResolver],
})
export class CaseModule {}
