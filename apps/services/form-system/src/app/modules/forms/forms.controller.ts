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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FormsService } from './forms.service'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormResponseDto } from './models/dto/form.response.dto'

@ApiTags('forms')
@Controller({ path: 'forms', version: ['1', VERSION_NEUTRAL] })
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Create new form' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Create new form',
  })
  @ApiBody({ type: CreateFormDto })
  @Post()
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponseDto> {
    const formResponse = await this.formsService.create(createFormDto)
    if (!formResponse) {
      throw new Error('Error')
    }
    return formResponse
  }

  @ApiOperation({ summary: 'Get all forms belonging to organization' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Get all forms belonging to organization',
  })
  @ApiParam({ name: 'organizationId', type: String })
  @Get('organization/:organizationId')
  async findAll(
    @Param('organizationId') organizationId: string,
  ): Promise<FormResponseDto> {
    return await this.formsService.findAll(organizationId)
  }

  @ApiOperation({ summary: 'Get FormResponse by formId' })
  @ApiCreatedResponse({
    type: FormResponseDto,
    description: 'Get FormResponse by formId',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FormResponseDto> {
    const formResponse = await this.formsService.findOne(id)
    if (!formResponse) {
      throw new NotFoundException(`Form not found`)
    }

    return formResponse
  }

  @ApiOperation({ summary: 'Delete form' })
  @ApiNoContentResponse({
    description: 'Delete field',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formsService.delete(id)
  }
}
