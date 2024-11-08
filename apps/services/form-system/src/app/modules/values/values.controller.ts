import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
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
import { ValuesService } from './values.service'
import { ValueDto } from './models/dto/value.dto'
import { UpdateValueDto } from './models/dto/updateValue.dto'
import { CreateValueDto } from './models/dto/createValue.dto'

@ApiTags('values')
@Controller({ path: 'values', version: ['1', VERSION_NEUTRAL] })
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  @ApiOperation({ summary: 'Creates a new value' })
  @ApiCreatedResponse({
    description: 'Creates a new value',
    type: ValueDto,
  })
  @ApiBody({ type: CreateValueDto })
  @Post()
  create(@Body() createValueDto: CreateValueDto): Promise<string> {
    return this.valuesService.create(createValueDto)
  }

  @ApiOperation({ summary: 'Update a value' })
  @ApiCreatedResponse({
    description: 'Update a value',
    type: ValueDto,
  })
  @ApiBody({ type: UpdateValueDto })
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateValueDto: UpdateValueDto,
  ): Promise<void> {
    return await this.valuesService.update(id, updateValueDto)
  }

  @ApiOperation({ summary: 'Delete value by id' })
  @ApiNoContentResponse({
    description: 'Delete value by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.valuesService.delete(id)
  }
}
