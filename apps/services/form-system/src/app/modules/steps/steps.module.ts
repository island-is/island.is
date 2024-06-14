import { Module } from '@nestjs/common'
import { StepsController } from './steps.controller'
import { StepsService } from './steps.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Step } from './models/step.model'

@Module({
  imports: [SequelizeModule.forFeature([Step])],
  controllers: [StepsController],
  providers: [StepsService],
  exports: [StepsService],
})
export class StepsModule {}
