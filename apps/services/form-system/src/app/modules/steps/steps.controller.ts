import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { StepsService } from './steps.service'
import { CreateStepDto } from './models/dto/createStep.dto'
import { Step } from './models/step.model'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('steps')
@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  create(@Body() createStepDto: CreateStepDto): Promise<Step> {
    return this.stepsService.create(createStepDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Steps',
    response: { status: 200, type: [Step] },
  })
  async findAll(): Promise<Step[]> {
    return await this.stepsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Step by id',
    response: { status: 200, type: Step },
  })
  async findOne(@Param('id') id: string): Promise<Step> {
    const step = await this.stepsService.findOne(id)
    if (!step) {
      throw new NotFoundException(`Step not found`)
    }

    return step
  }
}
