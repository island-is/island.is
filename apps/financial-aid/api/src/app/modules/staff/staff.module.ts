import { Module } from '@nestjs/common'
import { StaffResolver } from './staff.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [StaffResolver],
})
export class StaffModule {}
