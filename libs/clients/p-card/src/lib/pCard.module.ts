import { Module } from '@nestjs/common'
import { PCardApiProvider } from './pCardApiProvider'
import { PCardService } from './pCard.service'

@Module({
  providers: [PCardApiProvider, PCardService],
  exports: [PCardService],
})
export class PCardClientModule {}
