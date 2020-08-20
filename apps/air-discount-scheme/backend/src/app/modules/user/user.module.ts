import { Module } from '@nestjs/common'

import { PublicUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'

@Module({
  imports: [DiscountModule, FlightModule],
  controllers: [PublicUserController],
  providers: [UserService],
})
export class UserModule {}
