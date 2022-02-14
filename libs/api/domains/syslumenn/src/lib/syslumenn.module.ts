import { Module } from '@nestjs/common'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  imports: [SyslumennClientModule],
  providers: [SyslumennResolver],
})
export class SyslumennModule {}
