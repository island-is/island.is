import { Module } from '@nestjs/common'
import {
  AuthApiConfiguration,
  RulingsApiConfiguration,
} from './api-configuration'
import { exportedApis } from './apis'
import { ComplaintsCommitteeRulingsClientConfig } from './complaints-committee-rulings.config'

@Module({
  imports: [ComplaintsCommitteeRulingsClientConfig.registerOptional()],
  providers: [AuthApiConfiguration, RulingsApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
export class ComplaintsCommitteeRulingsClientModule {}
