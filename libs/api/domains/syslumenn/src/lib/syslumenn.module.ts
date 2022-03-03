import { Module } from '@nestjs/common'

import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { SyslumennResolver } from './syslumenn.resolver'

@Module({
  imports: [SyslumennClientModule],
  providers: [SyslumennResolver],
})
export class SyslumennModule {}
