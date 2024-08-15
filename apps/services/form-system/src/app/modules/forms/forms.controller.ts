import { Documentation } from '@island.is/nest/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { FormsService } from './forms.service'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormResponseDto } from './models/dto/form.response.dto'

@ApiTags('forms')
@Controller({ path: 'forms', version: ['1', VERSION_NEUTRAL] })
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Create new form',
  })
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponseDto> {
    const formResponse = await this.formsService.create(createFormDto)
    if (!formResponse) {
      throw new Error('Error')
    }
    return formResponse
  }

  @Get('organization/:organizationId')
  @Documentation({
    description: 'Get all forms belonging to organization',
    response: { status: 200, type: FormResponseDto },
  })
  async findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.findAll(organizationId)
  }

  @Get(':id')
  @Documentation({
    description: 'Get FormResponse by formId',
    response: { status: 200, type: FormResponseDto },
  })
  async findOne(@Param('id') id: string): Promise<FormResponseDto> {
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
