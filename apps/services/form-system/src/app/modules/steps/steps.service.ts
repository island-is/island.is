import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Step } from './models/step.model'
import { CreateStepDto } from './models/dto/createStep.dto'
import { Group } from '../groups/models/group.model'
import { Input } from '../inputs/models/input.model'
import { UpdateStepDto } from './models/dto/updateStep.dto'
import { StepDto } from './models/dto/step.dto'

@Injectable()
export class StepsService {
  constructor(
    @InjectModel(Step)
    private readonly stepModel: typeof Step,
  ) {}

  async findAll(): Promise<Step[]> {
    return await this.stepModel.findAll()
  }

  async findOne(id: string): Promise<Step> {
    const step = await this.stepModel.findByPk(id, {
      include: [
        {
          model: Group,
          as: 'groups',
          include: [{ model: Input, as: 'inputs' }],
        },
      ],
    })

    if (!step) {
      throw new NotFoundException(`Step with id '${id}' not found`)
    }

    return step
  }

  async create(createStepDto: CreateStepDto): Promise<Step> {
    const step = createStepDto as Step
    const newStep: Step = new this.stepModel(step)
    return await newStep.save()
  }

  async update(id: string, updateStepDto: UpdateStepDto): Promise<StepDto> {
    const step = await this.findOne(id)

    step.name = updateStepDto.name
    step.displayOrder = updateStepDto.displayOrder
    step.waitingText = updateStepDto.waitingText
    step.callRuleset = updateStepDto.callRuleset
    step.modified = new Date()

    await step.save()

    const stepDto: StepDto = {
      id: step.id,
      name: step.name,
      stepType: step.stepType,
      displayOrder: step.displayOrder,
      waitingText: step.waitingText,
      callRuleset: step.callRuleset,
    }

    return stepDto
  }

  async delete(id: string): Promise<void> {
    const step = await this.findOne(id)
    step?.destroy()
  }
}
