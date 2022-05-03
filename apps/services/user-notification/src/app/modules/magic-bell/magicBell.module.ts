import { Module } from '@nestjs/common'
import { MagicBellService } from './magicBell.service'

@Module({
  providers: [MagicBellService],
  exports: [MagicBellService],
})
export class MagicBellModule {}
