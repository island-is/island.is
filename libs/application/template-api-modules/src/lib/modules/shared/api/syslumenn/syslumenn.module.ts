import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { SyslumennService } from './syslumenn.service'

@Module({
  imports: [SyslumennClientModule],
  providers: [SyslumennService],
  exports: [SyslumennService],
})
export class SyslumennModule {}
