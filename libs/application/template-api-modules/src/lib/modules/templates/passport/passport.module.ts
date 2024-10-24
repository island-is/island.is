import { Module } from '@nestjs/common'
import { PassportService } from './passport.service'
import { SharedTemplateAPIModule } from '../../shared'
import { PassportsClientModule } from '@island.is/clients/passports'

@Module({
  imports: [SharedTemplateAPIModule, PassportsClientModule],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
