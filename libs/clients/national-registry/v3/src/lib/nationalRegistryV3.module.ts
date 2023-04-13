import { Module } from '@nestjs/common'
import { NationalRegistryV3ApiProvider } from './nationalRegistryV3Provider'

@Module({
  providers: [NationalRegistryV3ApiProvider],
  exports: [NationalRegistryV3ApiProvider],
})
export class NationalRegistryV3ClientModule {}
