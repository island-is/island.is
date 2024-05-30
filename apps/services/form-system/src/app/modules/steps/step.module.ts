import { Module } from '@nestjs/common'
import { StepsController } from './steps.controller'
import { StepsService } from './steps.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Step } from './step.model'

@Module({
  imports: [SequelizeModule.forFeature([Step])],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepModule {}
