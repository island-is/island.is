import { Module } from '@nestjs/common'

//import { CarResolver } from './car.resolver'
import { CarResolver } from './car.resolver'

@Module({
  providers: [CarResolver],
})
export class CarModule {}
