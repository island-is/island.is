import { Module } from '@nestjs/common'
import { EventModule } from '../event'

import { CaseResolver } from './case.resolver'

@Module({
  imports: [EventModule],
  providers: [CaseResolver],
})
export class CaseModule {}
