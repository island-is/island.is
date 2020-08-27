import { Module } from '@nestjs/common'

import { PublicUserController, PrivateUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'

@Module({
  imports: [DiscountModule, FlightModule],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
