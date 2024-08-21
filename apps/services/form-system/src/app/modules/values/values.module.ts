import { Module } from '@nestjs/common'
import { ValuesController } from './values.controller'
import { ValuesService } from './values.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Value } from './models/value.model'

@Module({
  imports: [SequelizeModule.forFeature([Value])],
  controllers: [ValuesController],
  providers: [ValuesService],
})
export class ValuesModule {}
