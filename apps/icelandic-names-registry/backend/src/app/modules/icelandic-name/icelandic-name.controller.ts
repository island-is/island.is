import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { AuditService } from '@island.is/nest/audit'
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

import { CreateIcelandicNameBodyDto, UpdateIcelandicNameBodyDto } from './dto'
import { IcelandicName } from './icelandic-name.model'
import { IcelandicNameService } from './icelandic-name.service'
import { ParseIcelandicAlphabetPipe, ParseIntPipe } from './pipes'
@Controller('api/icelandic-names-registry')
@ApiTags('icelandic-names-registry')
export class IcelandicNameController {
  constructor(
    private readonly icelandicNameService: IcelandicNameService,
    private readonly auditService: AuditService,
  ) {}

  @Get('names')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names.',
  })
  async getAll(): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getAll()
  }

  @Get('names/:id')
  @ApiOkResponse({
    type: IcelandicName,
    description: 'Gets icelandic name by id.',
  })
  @ApiNotFoundResponse({
    description: 'The name was not found.',
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<IcelandicName> {
    const result = await this.icelandicNameService.getById(id)

    if (!result) {
      throw new NotFoundException(`Name with id ${id} was not found!`)
    }

    return result
  }

  @Get('names/initial-letter/:initialLetter')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names by initial letter.',
  })
  async getByInitialLetter(
    @Param('initialLetter', ParseIcelandicAlphabetPipe) initialLetter: string,
  ): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getByInitialLetter(initialLetter)
  }

  @Get('names/search/:q')
  @ApiOkResponse({
    type: IcelandicName,
    isArray: true,
    description: 'Gets all icelandic names by search.',
  })
  async getBySearch(
    @Param('q', ParseIcelandicAlphabetPipe) q: string,
  ): Promise<IcelandicName[]> {
    return await this.icelandicNameService.getBySearch(q)
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.icelandicNamesRegistry)
  @Patch('names/:id')
  @ApiBearerAuth()
  @ApiOkResponse()
  async updateNameById(
    @Param('id') id: number,
    @Body() body: UpdateIcelandicNameBodyDto,
    @CurrentUser() user: User,
  ): Promise<IcelandicName> {
    const [affectedRows, [icelandicName]] =
      await this.icelandicNameService.updateNameById(id, body)

    if (!affectedRows) {
      throw new BadRequestException(`Could not update user by id: ${id}`)
    }

    this.auditService.audit({
      auth: user,
      action: 'updateNameById',
      resources: `${id}`,
      meta: { fields: Object.keys(body) },
    })

    return icelandicName
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.icelandicNamesRegistry)
  @Post('names')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiOkResponse()
  @ApiCreatedResponse({
    description: 'The name has been successfully created.',
    type: IcelandicName,
  })
  @ApiResponse({
    status: 400,
    description: 'The request data was missing or had invalid values.',
  })
  createName(
    @Body() body: CreateIcelandicNameBodyDto,
    @CurrentUser() user: User,
  ): Promise<IcelandicName> {
    return this.auditService.auditPromise<IcelandicName>(
      {
        auth: user,
        action: 'createName',
        resources: (name) => `${name.id}`,
      },
      this.icelandicNameService.createName(body),
    )
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.icelandicNamesRegistry)
  @Delete('names/:id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The name has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'The name was not found.',
  })
  async deleteById(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<number> {
    const count = await this.icelandicNameService.deleteById(id)

    if (count === 0) {
      throw new NotFoundException(`Name with id ${id} was not found!`)
    }

    this.auditService.audit({
      auth: user,
      action: 'deleteById',
      resources: `${id}`,
    })

    return count
  }
}
