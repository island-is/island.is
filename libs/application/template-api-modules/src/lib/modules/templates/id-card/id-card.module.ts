import { Module } from '@nestjs/common'
import { IdCardService } from './id-card.service'
import { SharedTemplateAPIModule } from '../../shared'
import { PassportsClientModule } from '@island.is/clients/passports'
import { ConfigModule } from '@nestjs/config'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ChargeFjsV2ClientModule,
    PassportsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [IdCardService],
  exports: [IdCardService],
})
export class IdCardModule {}
