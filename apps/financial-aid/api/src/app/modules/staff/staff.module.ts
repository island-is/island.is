import { Module } from '@nestjs/common'
import { StaffResolver } from './staff.resolver'

@Module({
  providers: [StaffResolver],
})
export class StaffModule {}
