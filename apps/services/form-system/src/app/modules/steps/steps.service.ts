import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Step } from './models/step.model'
import { CreateStepDto } from './models/dto/createStep.dto'
import { Group } from '../groups/models/group.model'
import { Input } from '../inputs/models/input.model'

@Injectable()
export class StepsService {
  constructor(
    @InjectModel(Step)
    private readonly stepModel: typeof Step,
  ) {}

  async findAll(): Promise<Step[]> {
    return await this.stepModel.findAll()
  }

  async findOne(id: string): Promise<Step | null> {
    const step = await this.stepModel.findByPk(id, {
      include: [
        {
          model: Group,
          as: 'groups',
          include: [{ model: Input, as: 'inputs' }],
        },
      ],
    })

    return step
  }

  async create(createStepDto: CreateStepDto): Promise<Step> {
    const step = createStepDto as Step
    const newStep: Step = new this.stepModel(step)
    return await newStep.save()
  }
}
