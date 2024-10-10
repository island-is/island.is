import { Module } from '@nestjs/common'

import { SyslumennApiProvider } from './syslumennClient.provider'
import { SyslumennService } from './syslumennClient.service'

@Module({
  providers: [SyslumennService, SyslumennApiProvider],
  exports: [SyslumennService],
})
export class SyslumennClientModule {}
