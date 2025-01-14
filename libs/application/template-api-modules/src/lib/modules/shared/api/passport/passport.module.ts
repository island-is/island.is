import { Module } from '@nestjs/common'
import { PassportService } from './passport.service'
import { PassportsClientModule } from '@island.is/clients/passports'

@Module({
  imports: [PassportsClientModule],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
