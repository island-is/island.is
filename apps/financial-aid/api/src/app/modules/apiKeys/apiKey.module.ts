import { Module } from '@nestjs/common'

import { ApiKeysResolver } from './apiKey.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [ApiKeysResolver],
})
export class ApiKeyModule {}
