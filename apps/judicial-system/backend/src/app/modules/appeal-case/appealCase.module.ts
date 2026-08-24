import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, EventModule, RepositoryModule, UserModule } from '..'
import { AppealCaseController } from './appealCase.controller'
import { AppealCaseService } from './appealCase.service'
import { LimitedAccessAppealCaseController } from './limitedAccessAppealCase.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => EventModule),
    forwardRef(() => RepositoryModule),
  ],
  controllers: [AppealCaseController, LimitedAccessAppealCaseController],
  providers: [AppealCaseService],
  exports: [AppealCaseService],
})
export class AppealCaseModule {}
