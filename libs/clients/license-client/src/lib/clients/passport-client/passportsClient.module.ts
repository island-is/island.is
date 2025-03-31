import { PassportsClientModule } from '@island.is/clients/passports'
import { PassportsClient } from './passportsClient.service'
import { Module } from '@nestjs/common'
import { IdentityDocumentClient } from './identityDocumentClient.service'

@Module({
  imports: [PassportsClientModule],
  providers: [PassportsClient, IdentityDocumentClient],
  exports: [PassportsClient, IdentityDocumentClient],
})
export class PassportsModule {}
