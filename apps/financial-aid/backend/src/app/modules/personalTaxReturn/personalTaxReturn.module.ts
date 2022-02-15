import { Module } from '@nestjs/common'

import { PersonalTaxReturnController } from './personalTaxReturn.controller'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { PersonalTaxReturnConfig } from '@island.is/clients/rsk/personal-tax-return'
import { PersonalTaxReturnModule as PersonalTaxReturnClientModule } from '@island.is/clients/rsk/personal-tax-return'
import { ConfigModule } from '@nestjs/config'
import { FileModule } from '../file/file.module'

@Module({
  controllers: [PersonalTaxReturnController],
  providers: [PersonalTaxReturnService],
  imports: [
    PersonalTaxReturnClientModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PersonalTaxReturnConfig],
    }),
  ],
})
export class PersonalTaxReturnModule {}
