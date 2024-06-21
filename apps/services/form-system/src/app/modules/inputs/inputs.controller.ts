import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { InputsService } from './inputs.service'
import { Input } from './models/input.model'
import { CreateInputDto } from './models/dto/createInput.dto'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateInputDto } from './models/dto/updateInput.dto'
import { InputDto } from './models/dto/input.dto'

@ApiTags('inputs')
@Controller('inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post()
  create(@Body() createInputDto: CreateInputDto): Promise<InputDto> {
    return this.inputsService.create(createInputDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Inputs',
    response: { status: 200, type: [Input] },
  })
  async findAll(): Promise<Input[]> {
    return await this.inputsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Input by id',
    response: { status: 200, type: InputDto },
  })
  async findOne(@Param('id') id: string): Promise<InputDto> {
    const input = await this.inputsService.findOne(id)
    if (!input) {
      throw new NotFoundException(`Input not found`)
    }

    return input
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    await this.inputsService.update(id, updateInputDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.inputsService.delete(id)
  }
}
