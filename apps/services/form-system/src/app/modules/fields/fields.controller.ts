import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { FieldsService } from './fields.service'
import { CreateFieldDto } from './models/dto/createField.dto'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'

@ApiTags('fields')
@Controller({ path: 'fields', version: ['1', VERSION_NEUTRAL] })
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(@Body() createFieldDto: CreateFieldDto): Promise<FieldDto> {
    return this.fieldsService.create(createFieldDto)
  }

  @Get(':id')
  @Documentation({
    description: 'Get Field by id',
    response: { status: 200, type: FieldDto },
  })
  async findOne(@Param('id') id: string): Promise<FieldDto> {
    const field = await this.fieldsService.findOne(id)
    if (!field) {
      throw new NotFoundException(`Field not found`)
    }

    return field
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ): Promise<void> {
    await this.fieldsService.update(id, updateFieldDto)
  }

  @Put()
  @Documentation({
    description: 'Update display order of fields',
    response: { status: 204 },
  })
  async updateDisplayOrder(
    @Body() updateFieldsDisplayOrderDto: UpdateFieldsDisplayOrderDto,
  ): Promise<void> {
    return this.fieldsService.updateDisplayOrder(updateFieldsDisplayOrderDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.fieldsService.delete(id)
  }
}
