import { Module } from '@nestjs/common'
import { MajorController } from './major.controller'
import { MajorService } from './major.service'
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
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule {}
