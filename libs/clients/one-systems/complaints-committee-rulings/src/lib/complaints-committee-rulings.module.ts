import { Module } from '@nestjs/common'
import { ComplaintsCommitteeRulingsClientService } from './complaints-committee-rulings.service'
import { ComplaintsCommitteeRulingsClientConfig } from './complaints-committee-rulings.config'
import {
  ApiConfig,
  ApiProviders,
} from './complaints-committee-rulings.provider'

@Module({
  imports: [ComplaintsCommitteeRulingsClientConfig.registerOptional()],
  providers: [
    ApiConfig,
    ...ApiProviders,
    ComplaintsCommitteeRulingsClientService,
  ],
  exports: [ComplaintsCommitteeRulingsClientService],
})
export class ComplaintsCommitteeRulingsClientModule {}
