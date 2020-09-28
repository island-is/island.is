import { Module } from '@nestjs/common'
import { IndexingModule } from '@island.is/elastic-indexing'

@Module({
  imports: [IndexingModule],
})
export class AppModule {}
