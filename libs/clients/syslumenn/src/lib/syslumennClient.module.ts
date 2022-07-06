import { Module } from '@nestjs/common'
import { SyslumennService } from './syslumennClient.service'

@Module({
  providers: [SyslumennService],
  exports: [SyslumennService],
})
export class SyslumennClientModule {}
