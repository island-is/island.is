import { Module } from '@nestjs/common'
import { ValuesController } from './values.controller'
import { ValuesService } from './values.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Value } from './models/value.model'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'

@Module({
  imports: [SequelizeModule.forFeature([Value, ApplicationEvent])],
  controllers: [ValuesController],
  providers: [ValuesService],
})
export class ValuesModule {}
