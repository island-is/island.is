import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { StepsService } from './steps.service'
import { CreateStepDto } from './models/dto/createStep.dto'
import { Step } from './models/step.model'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateStepDto } from './models/dto/updateStep.dto'
import { StepDto } from './models/dto/step.dto'

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

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.stepsService.delete(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStepDto: UpdateStepDto,
  ): Promise<StepDto> {
    return await this.stepsService.update(id, updateStepDto)
  }
}
