import { Module } from '@nestjs/common'
import { IslykillApiModule } from './islykill.provider'
import { IslykillService } from './islykill.service'

@Module({
  providers: [IslykillApiModule, IslykillService],
  exports: [IslykillApiModule, IslykillService],
})
export class IslykillClientModule {}
