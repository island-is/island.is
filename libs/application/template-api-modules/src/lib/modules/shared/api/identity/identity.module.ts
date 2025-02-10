import { Module } from '@nestjs/common'
import { IdentityClientModule } from '@island.is/clients/identity'
import { IdentityService } from './identity.service'

@Module({
  imports: [IdentityClientModule],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
