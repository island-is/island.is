import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { PassportsClientModule } from '@island.is/clients/passports'

import { PassportResolver } from './passport.resolver'
import { PassportService } from './passport.service'

@Module({
  providers: [PassportResolver, PassportService],
  imports: [AuthModule, PassportsClientModule],
  exports: [PassportService],
})
export class PassportModule {}
