import { Module, HttpModule } from '@nestjs/common'
import { Base64 } from 'js-base64'

import { environment } from '../../../environments'
import { NationalRegistryService } from './nationalRegistry.service'
import { CacheModule } from '../cache'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

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
    NationalRegistryClientModule,
  ],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
