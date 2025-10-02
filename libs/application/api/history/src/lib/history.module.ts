import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { HistoryService } from './history.service'
import { History } from './history.model'
import { HistoryBuilder } from './historyBuilder'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { IdentityClientModule } from '@island.is/clients/identity'

@Module({
  imports: [
    SequelizeModule.forFeature([History]),
    CmsTranslationsModule,
    IdentityClientModule,
  ],
  providers: [HistoryService, HistoryBuilder],
  exports: [HistoryService, HistoryBuilder],
})
export class HistoryModule {}
