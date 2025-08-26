import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { FieldsService } from './fields.service'
import { CreateFieldDto } from './models/dto/createField.dto'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UpdateFieldDto } from './models/dto/updateField.dto'
import { FieldDto } from './models/dto/field.dto'
import { UpdateFieldsDisplayOrderDto } from './models/dto/updateFieldsDisplayOrder.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('fields')
@Controller({ path: 'fields', version: ['1', VERSION_NEUTRAL] })
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @ApiOperation({ summary: 'Create a field' })
  @ApiCreatedResponse({
    description: 'Create a field',
    type: FieldDto,
  })
  @ApiBody({ type: CreateFieldDto })
  @Post()
  create(@Body() createFieldDto: CreateFieldDto): Promise<FieldDto> {
    return this.fieldsService.create(createFieldDto)
  }

  @ApiOperation({ summary: 'Update field' })
  @ApiNoContentResponse({
    description: 'Update field',
  })
  @ApiBody({ type: UpdateFieldDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ): Promise<void> {
    await this.fieldsService.update(id, updateFieldDto)
  }

  @ApiOperation({ summary: 'Update display order of fields' })
  @ApiNoContentResponse({
    description: 'Update display order of fields',
  })
  @ApiBody({ type: UpdateFieldsDisplayOrderDto })
  @Put()
  async updateDisplayOrder(
    @Body() updateFieldsDisplayOrderDto: UpdateFieldsDisplayOrderDto,
  ): Promise<void> {
    return this.fieldsService.updateDisplayOrder(updateFieldsDisplayOrderDto)
  }

  @ApiOperation({ summary: 'Delete field by id' })
  @ApiNoContentResponse({
    description: 'Delete field by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.fieldsService.delete(id)
  }
}
