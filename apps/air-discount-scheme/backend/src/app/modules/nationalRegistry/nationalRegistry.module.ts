import { HttpModule,Module } from '@nestjs/common'
import { Base64 } from 'js-base64'

import { environment } from '../../../environments'
import { CacheModule } from '../cache'

import { NationalRegistryService } from './nationalRegistry.service'

const { nationalRegistry } = environment

@Module({
  imports: [
    CacheModule,
    HttpModule.register({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Base64.encode(
          `${nationalRegistry.username}:${nationalRegistry.password}`,
        )}`,
      },
    }),
  ],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
