import { PassportsClientModule } from '@island.is/clients/passports'
import { PassportsClient } from './passportsClient.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [PassportsClientModule],
  providers: [PassportsClient],
  exports: [PassportsClient],
})
export class PassportsModule {}
