import { Module } from '@nestjs/common'
import { IndexingModule } from '@island.is/content-search-indexer'

@Module({
  imports: [IndexingModule],
})
export class AppModule {}
