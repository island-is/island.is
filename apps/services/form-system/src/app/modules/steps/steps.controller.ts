import { Body, Controller, Post } from '@nestjs/common'
import { StepsService } from './steps.service'
import { CreateStepDto } from './dto/create-step.dto'
import { Step } from './step.model'

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  create(@Body() createStepDto: CreateStepDto): Promise<Step> {
    return this.stepsService.create(createStepDto)
  }
}
