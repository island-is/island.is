import { Module } from '@nestjs/common'
import { PassportsClientModule } from '@island.is/clients/passports'
import { PassportsResolver } from './passports.resolver'

@Module({
  providers: [PassportsResolver],
  imports: [PassportsClientModule],
})
export class PassportsModule {}
