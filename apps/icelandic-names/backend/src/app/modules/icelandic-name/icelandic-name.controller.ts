import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { IcelandicNameService } from './icelandic-name.service'
import { IcelandicName } from './icelandic-name.model'
import { UpdateIcelandicNameBody, CreateIcelandicNameBody } from './dto'

@Controller('api')
@ApiTags('icelandic-names')
export class IcelandicNameController {
  constructor(private readonly icelandicNameService: IcelandicNameService) {}

  @Get('icelandic-names/all')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names',
  })
  getAll(): Promise<IcelandicName[]> {
    return this.icelandicNameService.getAll()
  }

  @Get('icelandic-names/:initialLetter')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names by initial letter',
  })
  getByInitialLetter(
    @Param('initialLetter') initialLetter: string,
  ): Promise<IcelandicName[]> {
    return this.icelandicNameService.getByInitialLetter(initialLetter)
  }

  @Post('icelandic-names/:id/update')
  @ApiOkResponse()
  async updateNameById(
    @Param('id') id: number,
    @Body() body: UpdateIcelandicNameBody,
  ): Promise<void> {
    const [
      affectedRows,
      [icelandicName],
    ] = await this.icelandicNameService.updateNameById(id, body)

    if (!icelandicName) {
      throw new BadRequestException(`Could not update user by id: ${id}`)
    }
  }

  @Post('icelandic-names/create')
  @ApiOkResponse()
  async createName(@Body() body: CreateIcelandicNameBody): Promise<void> {
    const result = await this.icelandicNameService.createName(body)
  }

  @Delete('icelandic-names/:id/delete')
  @ApiNoContentResponse()
  async deleteById(@Param('id') id: number): Promise<void> {
    const icelandicName = await this.icelandicNameService.getById(id)

    if (!icelandicName) {
      throw new NotFoundException(`Name with id ${id} was not found`)
    }

    await this.icelandicNameService.deleteById(id)
  }
}
