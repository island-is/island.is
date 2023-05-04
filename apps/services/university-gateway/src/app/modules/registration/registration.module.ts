import { Module } from '@nestjs/common'
import { RegistrationController } from './registration.controller'
import { RegistrationService } from './registration.service'
import {
  UgReykjavikUniversityClientModule,
  UgReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    UgReykjavikUniversityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UgReykjavikUniversityClientConfig],
    }),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
