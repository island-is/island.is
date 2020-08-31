import { Module, HttpModule } from '@nestjs/common'
import { Base64 } from 'js-base64'

import { environment } from '../../../environments'
import { ThjodskraService } from './thjodskra.service'
import { CacheModule } from '../cache'

const { thjodskra } = environment

@Module({
  imports: [
    CacheModule,
    HttpModule.register({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Base64.encode(
          `${thjodskra.username}:${thjodskra.password}`,
        )}`,
      },
    }),
  ],
  providers: [ThjodskraService],
  exports: [ThjodskraService],
})
export class ThjodskraModule {}
