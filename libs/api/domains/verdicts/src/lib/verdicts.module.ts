import { Module } from '@nestjs/common'
import { VerdictsClientModule } from '@island.is/clients/verdicts'
import { VerdictsResolver } from './verdicts.resolver'
import { VerdictsService } from './verdicts.service'
import { verdictsFetch } from './verdicts.fetch'

@Module({
  imports: [VerdictsClientModule],
  providers: [verdictsFetch, VerdictsResolver, VerdictsService],
})
export class VerdictsModule {}
