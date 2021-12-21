import { Module } from '@nestjs/common'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennService } from './syslumenn.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  imports: [SyslumennClientModule],
  providers: [SyslumennResolver, SyslumennService],
  exports: [SyslumennService],
})
export class SyslumennModule {}
