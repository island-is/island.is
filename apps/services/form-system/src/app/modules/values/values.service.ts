import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Value } from './models/value.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { ValueDto } from './models/dto/value.dto'
import { UpdateValueDto } from './models/dto/updateValue.dto'

@Injectable()
export class ValuesService {
  constructor(
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
  ) {}

  async update(id: string, updateValueDto: UpdateValueDto): Promise<ValueDto> {
    const value = await this.valueModel.findByPk(id)

    if (!value) {
      throw new NotFoundException(`Value with id '${id}' not found`)
    }

    value.json = updateValueDto.json

    await value.save()

    const keys = ['id', 'json']
    const valueDto: ValueDto = defaults(
      pick(value, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as ValueDto

    return valueDto
  }
}
