import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'

import { NationalIdGuard } from '../../common'
import { IcelandicNameService } from './icelandic-name.service'
import { IcelandicName } from './icelandic-name.model'
import { UpdateIcelandicNameBodyDto, CreateIcelandicNameBodyDto } from './dto'

@Controller('api/icelandic-names-registry')
@ApiTags('icelandic-names-registry')
export class IcelandicNameController {
  constructor(private readonly icelandicNameService: IcelandicNameService) {}

  @Get()
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names.',
  })
  async getAll(): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getAll()
  }

  @Get(':id')
  @ApiOkResponse({
    type: IcelandicName,
    description: 'Gets icelandic name by id.',
  })
  @ApiNotFoundResponse({
    description: 'The name was not found.',
  })
  async getById(@Param('id') id: number): Promise<IcelandicName> {
    const result = await this.icelandicNameService.getById(id)

    if (!result) {
      throw new NotFoundException(`Name with id ${id} was not found!`)
    }

    return result
  }

  @Get('initial-letter/:initialLetter')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names by initial letter.',
  })
  async getByInitialLetter(
    @Param('initialLetter') initialLetter: string,
  ): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getByInitialLetter(initialLetter)
  }

  @Get('search/:q')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names by search.',
  })
  async getBySearch(@Param('q') q: string): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getBySearch(q)
  }

  @UseGuards(IdsAuthGuard, NationalIdGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse()
  async updateNameById(
    @Param('id') id: number,
    @Body() body: UpdateIcelandicNameBodyDto,
  ): Promise<IcelandicName> {
    const [
      affectedRows,
      [icelandicName],
    ] = await this.icelandicNameService.updateNameById(id, body)

    if (!affectedRows) {
      throw new BadRequestException(`Could not update user by id: ${id}`)
    }

    return icelandicName
  }

  @UseGuards(IdsAuthGuard, NationalIdGuard)
  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The name has been successfully created.',
    type: IcelandicName,
  })
  @ApiResponse({
    status: 400,
    description: 'The request data was missing or had invalid values.',
  })
  createName(@Body() body: CreateIcelandicNameBodyDto): Promise<IcelandicName> {
    return this.icelandicNameService.createName(body)
  }

  @UseGuards(IdsAuthGuard, NationalIdGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The name has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'The name was not found.',
  })
  async deleteById(@Param('id') id: number): Promise<void> {
    const count = await this.icelandicNameService.deleteById(id)

    if (count === 0) {
      throw new NotFoundException(`Name with id ${id} was not found!`)
    }
  }
}
