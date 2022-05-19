import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
// import { AssetsClientModule } from '@island.is/clients/assets'

import { PassportResolver } from './api-domains-passport.resolver'
import { PassportService } from './api-domains-passport.service'

@Module({
  providers: [PassportResolver, PassportService],
  // imports: [AssetsClientModule, AuthModule],
  imports: [AuthModule],
  exports: [PassportService],
})
export class PassportModule {}
