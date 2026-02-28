import { Module } from '@nestjs/common'
import { ElfurClientService } from './elfur.service'
import { apiProviders } from './providers'

@Module({
  providers: [...apiProviders, ElfurClientService],
  exports: [ElfurClientService],
})
export class ElfurClientModule {}
