import { Module } from '@nestjs/common'

import { ApiKeysResolver } from './apiKey.resolver'

@Module({
  providers: [ApiKeysResolver],
})
export class ApiKeyModule {}
