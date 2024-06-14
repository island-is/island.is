import { Injectable } from '@nestjs/common'
import { Input } from './models/input.model'
import { CreateInputDto } from './models/dto/createInput.dto'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class InputsService {
  constructor(
    @InjectModel(Input)
    private readonly inputModel: typeof Input,
  ) {}

  async findAll(): Promise<Input[]> {
    return await this.inputModel.findAll()
  }

  async findOne(id: string): Promise<Input | null> {
    const input = await this.inputModel.findByPk(id)

    return input
  }

  async create(createInputDto: CreateInputDto): Promise<Input> {
    const input = createInputDto as Input
    const newInput: Input = new this.inputModel(input)
    return await newInput.save()
  }
}
