import { DynamicModule, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import {
  DocumentClient,
  DocumentClientConfig,
  DOCUMENT_CLIENT_CONFIG,
} from './documentClient'

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class DocumentsClientModule {
  static register(config: DocumentClientConfig): DynamicModule {
    return {
      module: DocumentsClientModule,
      imports: [
        HttpModule.register({
          timeout: 60000,
        }),
      ],
      providers: [
        DocumentClient,
        {
          provide: DOCUMENT_CLIENT_CONFIG,
          useValue: config,
        },
      ],
      exports: [DocumentClient],
    }
  }
}
