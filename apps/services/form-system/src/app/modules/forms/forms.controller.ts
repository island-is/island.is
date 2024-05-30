import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Documentation } from '@island.is/nest/swagger'
import { FormsService } from './forms.service'
import { Form } from './form.model'
import { ApiTags } from '@nestjs/swagger'
import { CreateFormDto } from './dto/create-form.dto'

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formsService.create(createFormDto as Form)
  }

  @Get()
  @Documentation({
    description: 'Get all Forms',
    response: { status: 200, type: [Form] },
  })
  async findAll(): Promise<Form[]> {
    return await this.formsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Form by id',
    response: { status: 200, type: Form },
  })
  async findOne(@Param('id') id: number): Promise<Form> {
    const form = await this.formsService.findOne(id)
    if (!form) {
      throw new NotFoundException(`Form not found`)
    }

    return form
  }
}
