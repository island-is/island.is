import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DocumentClient } from './documentClient'

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  providers: [DocumentClient],
  exports: [DocumentClient],
})
export class DocumentsClientModule {}
