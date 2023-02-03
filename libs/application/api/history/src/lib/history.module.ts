import { SequelizeConfigService } from '@island.is/application/api/core'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { HistoryService } from './history.service'
import { History } from './history.model'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([History]),
  ],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
