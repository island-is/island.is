import {
  Body,
  Controller,
  Get,
  Delete,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { Documentation } from '@island.is/nest/swagger'
import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { ApiTags } from '@nestjs/swagger'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponse } from './models/dto/form.response.dto'

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Documentation({
    description: 'Create new form',
    response: { status: 200, type: FormResponse },
  })
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponse> {
    const formResponse = await this.formsService.create(createFormDto)
    if (!formResponse) {
      throw new Error('Error')
    }
    return formResponse
  }

  @Get('organization/:organizationId')
  @Documentation({
    description: 'Get all forms belonging to organization',
    response: { status: 200, type: [Form] },
  })
  async findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<Form[]> {
    return await this.formsService.findAll(organizationId)
  }

  @Get(':id')
  @Documentation({
    description: 'Get FormResponse by formId',
    response: { status: 200, type: FormResponse },
  })
  async findOne(@Param('id') id: string): Promise<FormResponse> {
    const formResponse = await this.formsService.findOne(id)
    if (!formResponse) {
      throw new NotFoundException(`Form not found`)
    }

    return formResponse
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formsService.delete(id)
  }
}
