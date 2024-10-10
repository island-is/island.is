import { Module } from '@nestjs/common'
import { PassportAnnulmentService } from './passport-annulment.service'
import { PassportsClientModule } from '@island.is/clients/passports'

@Module({
  imports: [PassportsClientModule],
  providers: [PassportAnnulmentService],
  exports: [PassportAnnulmentService],
})
export class PassportAnnulmentModule {}
