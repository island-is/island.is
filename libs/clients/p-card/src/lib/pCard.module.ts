import { Module } from '@nestjs/common'
import { PCardApiProvider } from './pCardApiProvider'

@Module({
  providers: [PCardApiProvider],
  exports: [PCardApiProvider],
})
export class PCardModule {}
