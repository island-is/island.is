import { Module } from '@nestjs/common'
import { PropertiesApiProvider } from './PropertiesApiProvider'

@Module({
  providers: [PropertiesApiProvider],
  exports: [PropertiesApiProvider],
})
export class AssetsClientModule {}
