import {
  IdpProviderService,
  IdpProvider,
  IdpProviderDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('idp-provider')
@Controller('backend/idp-provider')
export class IdpProviderController {
  constructor(private readonly idpProviderService: IdpProviderService) {}

  /** Gets all idp restrictions and count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get()
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(IdpProvider) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: IdpProvider[]; count: number } | null> {
    if (searchString) {
      const idps = await this.idpProviderService.find(searchString, page, count)
      return idps
    } else {
      const idps = await this.idpProviderService.findAndCountAll(page, count)
      return idps
    }
  }

  /** Finds available idp restrictions */
  @Scopes(Scope.root, Scope.full)
  @Get(':name')
  @ApiOkResponse({ type: IdpProvider })
  async findByPk(@Param('name') name: string): Promise<IdpProvider | null> {
    return await this.idpProviderService.findByPk(name)
  }

  /** Adds new IDP provider */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: IdpProvider })
  async create(@Body() idpProvider: IdpProviderDTO): Promise<IdpProvider> {
    return await this.idpProviderService.create(idpProvider)
  }

  /** Deletes an idp provider */
  @Scopes(Scope.root, Scope.full)
  @Delete(':name')
  @ApiCreatedResponse()
  async delete(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    return await this.idpProviderService.delete(name)
  }

  /** Deletes an idp provider */
  @Scopes(Scope.root, Scope.full)
  @Put(':name')
  @ApiCreatedResponse()
  async update(
    @Param('name') name: string,
    @Body() idpProvider: IdpProviderDTO,
  ): Promise<[number, IdpProvider[]] | null> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!idpProvider) {
      throw new BadRequestException('idpProvider object must be provided')
    }

    return await this.idpProviderService.update(idpProvider, name)
  }
}
