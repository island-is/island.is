import { Module } from '@nestjs/common'
import { PropertiesApiProvider } from './properties-api.provider'

@Module({
  providers: [PropertiesApiProvider],
  exports: [PropertiesApiProvider],
})
export class AssetsClientModule {}
