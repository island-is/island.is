import { forwardRef, Module } from '@nestjs/common'

import {
  PrivateDiscountController,
  PublicDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { NationalRegistryModule } from '../nationalRegistry'
import { FlightModule } from '../flight'
import { UserModule } from '../user'
import { ExplicitCode } from './discount.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([ExplicitCode]),
    CacheModule,
    NationalRegistryModule,
    forwardRef(() => FlightModule),
    UserModule,
  ],
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
