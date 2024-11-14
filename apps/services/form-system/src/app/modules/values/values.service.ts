import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Value } from './models/value.model'
import { UpdateValueDto } from './models/dto/updateValue.dto'
import { CreateValueDto } from './models/dto/createValue.dto'

@Injectable()
export class ValuesService {
  constructor(
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
  ) {}

  async create(createValueDto: CreateValueDto): Promise<string> {
    if (createValueDto.order === 0) {
      throw new PreconditionFailedException(`order of new value cannot be 0`)
    }

    const newValue: Value = new this.valueModel(createValueDto as Value)
    await newValue.save()

    return newValue.id
  }

  async update(id: string, updateValueDto: UpdateValueDto): Promise<void> {
    const value = await this.valueModel.findByPk(id)

    if (!value) {
      throw new NotFoundException(`Value with id '${id}' not found`)
    }

    value.json = updateValueDto.json

    await value.save()
  }

  async delete(id: string): Promise<void> {
    const value = await this.valueModel.findByPk(id)

    if (!value) {
      throw new NotFoundException(`Value with id '${id}' not found`)
    }

    if (value.order === 0) {
      throw new PreconditionFailedException(
        `Value with id '${id}' cannot be deleted`,
      )
    }

    value.destroy()
  }
}
