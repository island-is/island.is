import { Module } from '@nestjs/common'
import { IndexingModule } from 'libs/elastic-indexing/src'

@Module({
  imports: [IndexingModule],
})
export class AppModule {}
