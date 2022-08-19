import { Module } from '@nestjs/common'
import { PassportsApiProvider } from './PassportsApiProvider'

@Module({
  providers: [PassportsApiProvider],
  exports: [PassportsApiProvider],
})
export class PassportsClientModule {}
