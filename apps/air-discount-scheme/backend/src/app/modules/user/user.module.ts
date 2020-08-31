import { Module } from '@nestjs/common'

import { PublicUserController, PrivateUserController } from './user.controller'
import { UserService } from './user.service'
import { DiscountModule } from '../discount'
import { FlightModule } from '../flight'
import { ThjodskraModule } from '../thjodskra'

@Module({
  imports: [DiscountModule, FlightModule, ThjodskraModule],
  controllers: [PublicUserController, PrivateUserController],
  providers: [UserService],
})
export class UserModule {}
