import { Module } from '@nestjs/common'
import { IslykillApiModule } from './islykill.provider'

@Module({
  providers: [IslykillApiModule],
  exports: [IslykillApiModule],
})
export class IslykillClientModule {}
