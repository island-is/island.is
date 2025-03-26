import { Module } from '@nestjs/common'
import { SyslumennService } from './syslumennClient.service'
import { IdsClientConfig } from '@island.is/nest/config'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [SyslumennService],
  exports: [SyslumennService],
})
export class SyslumennClientModule {}
