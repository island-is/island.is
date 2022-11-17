import { Module } from '@nestjs/common'
import { PropertiesV2ApiProvider } from './PropertiesV2ApiProvider'

@Module({
  providers: [PropertiesV2ApiProvider],
  exports: [PropertiesV2ApiProvider],
})
export class AssetsV2ClientModule {}
