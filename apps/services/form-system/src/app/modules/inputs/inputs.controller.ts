import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { InputsService } from './inputs.service'
import { Input } from './models/input.model'
import { CreateInputDto } from './models/dto/createInput.dto'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('inputs')
@Controller('inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post()
  create(@Body() createInputDto: CreateInputDto): Promise<Input> {
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
    response: { status: 200, type: Input },
  })
  async findOne(@Param('id') id: string): Promise<Input> {
    const input = await this.inputsService.findOne(id)
    if (!input) {
      throw new NotFoundException(`Input not found`)
    }

    return input
  }
}
