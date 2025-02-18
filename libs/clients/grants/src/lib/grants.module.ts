import { Module } from '@nestjs/common'
import { GrantsService } from './grant.service'

@Module({
  providers: [GrantsService],
  exports: [GrantsService],
})
export class GrantsClientModule {}
