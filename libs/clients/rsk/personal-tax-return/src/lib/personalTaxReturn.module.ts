import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

import { PersonalTaxReturnApi } from './personalTaxReturnApi.service'
import { PersonalTaxReturnConfig } from './personalTaxReturn.config'

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [PersonalTaxReturnConfig],
    }),
  ],
  providers: [PersonalTaxReturnApi],
  exports: [PersonalTaxReturnApi],
})
export class PersonalTaxReturnModule {}
