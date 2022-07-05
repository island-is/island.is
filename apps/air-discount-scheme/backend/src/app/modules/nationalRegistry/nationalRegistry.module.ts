import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { Base64 } from 'js-base64'

import { environment } from '../../../environments'
import { NationalRegistryService } from './nationalRegistry.service'
import { CacheModule } from '../cache'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

const { nationalRegistry } = environment

@Module({
  imports: [CacheModule, NationalRegistryClientModule],
  providers: [NationalRegistryService],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
