import { Module } from '@nestjs/common'
import { VerdictsClientModule } from '@island.is/clients/verdicts'
import { VerdictsResolver } from './verdicts.resolver'
import { VerdictsService } from './verdicts.service'

@Module({
  imports: [VerdictsClientModule],
  providers: [VerdictsResolver, VerdictsService],
})
export class VerdictsModule {}
