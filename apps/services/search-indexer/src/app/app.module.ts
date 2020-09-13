import { Module } from '@nestjs/common'
import { IndexingModule } from '@island.is/indexing'

@Module({
  imports: [IndexingModule]
})

export class AppModule { }
