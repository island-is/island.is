import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Step } from './step.model'
import { CreateStepDto } from './dto/create-step.dto'

@Injectable()
export class StepsService {
  constructor(
    @InjectModel(Step)
    private readonly stepModel: typeof Step,
  ) {}

  async create(createStepDto: CreateStepDto): Promise<Step> {
    const step = createStepDto as Step
    const newStep: Step = new this.stepModel(step)
    return await newStep.save()
  }
}
