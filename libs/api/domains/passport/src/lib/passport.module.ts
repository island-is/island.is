import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { PassportsClientModule } from '@island.is/clients/passports'

import { PassportResolver } from './passport.resolver'

@Module({
  providers: [PassportResolver],
  imports: [AuthModule, PassportsClientModule],
})
export class PassportModule {}
