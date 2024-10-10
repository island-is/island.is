import { Global, Module } from '@nestjs/common'
import { EnhancedFetchProvider } from './enhanced-fetch.provider'

@Global()
@Module({
  providers: [EnhancedFetchProvider],
  exports: [EnhancedFetchProvider],
})
export class EnhancedFetchModule {}
