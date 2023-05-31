import { Module } from '@nestjs/common'
import { UniversityController } from './university.controller'
import { UniversityService } from './university.service'
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
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
