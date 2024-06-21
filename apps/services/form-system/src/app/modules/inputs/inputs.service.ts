import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { InputSettingsService } from '../inputSettings/inputSettings.service'
import { CreateInputDto } from './models/dto/createInput.dto'
import { InputDto } from './models/dto/input.dto'
import { UpdateInputDto } from './models/dto/updateInput.dto'
import { InputMapper } from './models/input.mapper'
import { Input } from './models/input.model'

@Injectable()
export class InputsService {
  constructor(
    @InjectModel(Input)
    private readonly inputModel: typeof Input,
    private readonly inputSettingsService: InputSettingsService,
    private readonly inputMapper: InputMapper,
  ) {}

  async findAll(): Promise<Input[]> {
    return await this.inputModel.findAll()
  }

  async findOne(id: string): Promise<InputDto> {
    const input = await this.findById(id)
    const inputSettingsDto = await this.inputSettingsService.findOne(
      id,
      input.inputType,
    )

    const inputDto: InputDto = this.inputMapper.mapInputToInputDto(
      input,
      inputSettingsDto,
    )

    return inputDto
  }

  async findById(id: string): Promise<Input> {
    const input = await this.inputModel.findByPk(id)

    if (!input) {
      throw new NotFoundException(`Input with id '${id}' not found`)
    }

    return input
  }

  async create(createInputDto: CreateInputDto): Promise<InputDto> {
    const { groupId } = createInputDto

    const newInput: Input = await this.inputModel.create({
      groupId: groupId,
    } as Input)

    const newInputSettingsDto = await this.inputSettingsService.create(
      newInput.id,
    )

    const inputDto: InputDto = this.inputMapper.mapInputToInputDto(
      newInput,
      newInputSettingsDto,
    )

    return inputDto
  }

  async update(id: string, updateInputDto: UpdateInputDto): Promise<void> {
    const input = await this.findById(id)

    this.inputMapper.mapUpdateInputDtoToInput(input, updateInputDto)

    if (updateInputDto.inputSettings) {
      await this.inputSettingsService.update(id, updateInputDto.inputSettings)
    }

    await input.save()
  }

  async delete(id: string): Promise<void> {
    const input = await this.findById(id)
    input?.destroy()
  }
}
