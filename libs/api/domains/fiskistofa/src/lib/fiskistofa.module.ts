import { Module } from '@nestjs/common'
import { FiskistofaResolver } from './fiskistofa.resolver'
import { FiskistofaClientModule } from '@island.is/clients/fiskistofa'

@Module({
  imports: [FiskistofaClientModule],
  providers: [FiskistofaResolver],
})
export class FiskistofaModule {}
