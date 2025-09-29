import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { HistoryService } from './history.service'
import { History } from './history.model'
import { HistoryBuilder } from './historyBuilder'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { IdentityClientModule } from '@island.is/clients/identity'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { ConfigModule } from '@island.is/nest/config'

@Module({
  imports: [
    SequelizeModule.forFeature([History]),
    CmsTranslationsModule,
    IdentityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryV3ClientConfig, CompanyRegistryConfig],
    }),
  ],
  providers: [HistoryService, HistoryBuilder],
  exports: [HistoryService, HistoryBuilder],
})
export class HistoryModule {}
