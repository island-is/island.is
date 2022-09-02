import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { IslykillApiModule } from './islykill.provider'
import { IslykillService } from './islykill.service'
import { IslykillClientConfig } from './islykill.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [IslykillClientConfig],
    }),
  ],
  providers: [IslykillApiModule, IslykillService],
  exports: [IslykillApiModule, IslykillService],
})
export class IslykillClientModule {}
