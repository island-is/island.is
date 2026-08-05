import { Module } from '@nestjs/common'
import { ComplaintsCommitteeRulingsClientModule } from '@island.is/clients/one-systems-complaints-committee-rulings'
import { OneSystemsRulingsResolver } from './oneSystemsRulings.resolver'
import { OneSystemsRulingsService } from './oneSystemsRulings.service'

@Module({
  imports: [ComplaintsCommitteeRulingsClientModule],
  providers: [OneSystemsRulingsResolver, OneSystemsRulingsService],
  exports: [OneSystemsRulingsService],
})
export class OneSystemsRulingsModule {}
