import { Module } from '@nestjs/common'
import { OpenDataClientModule } from '@island.is/clients/open-data'
import { OpenDataResolver } from './openData.resolver'
import { OpenDataService } from './openData.service'

@Module({
  imports: [OpenDataClientModule],
  providers: [OpenDataResolver, OpenDataService],
  exports: [OpenDataService],
})
export class OpenDataModule {}
