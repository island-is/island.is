import { Module } from '@nestjs/common'

import { AppealCaseResolver } from './appealCase.resolver'
import { LimitedAccessAppealCaseResolver } from './limitedAccessAppealCase.resolver'

@Module({
  providers: [AppealCaseResolver, LimitedAccessAppealCaseResolver],
})
export class AppealCaseModule {}
