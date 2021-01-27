import {
  IdpProviderService,
  IdpRestriction,
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
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('idp-provider')
@Controller('backend/idp-provider')
export class IdpProviderController {
  constructor(private readonly idpProviderService: IdpProviderService) {}

  /** Gets all idp restrictions and count of rows */
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
              items: { $ref: getSchemaPath(IdpRestriction) },
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
  ): Promise<{ rows: IdpRestriction[]; count: number } | null> {
    if (searchString) {
      const idps = await this.idpProviderService.find(searchString, page, count)
      return idps
    } else {
      const idps = await this.idpProviderService.findAndCountAll(page, count)
      return idps
    }
  }

  /** Finds available idp restrictions */
  @Get(':name')
  @ApiOkResponse({ type: IdpRestriction })
  async findByPk(@Param('name') name: string): Promise<IdpRestriction | null> {
    return await this.idpProviderService.findByPk(name)
  }

  /** Adds new IDP provider */
  @Post()
  @ApiCreatedResponse({ type: IdpRestriction })
  async create(@Body() idpProvider: IdpProviderDTO): Promise<IdpRestriction> {
    return await this.idpProviderService.create(idpProvider)
  }

  /** Deletes an idp provider */
  @Delete(':name')
  @ApiCreatedResponse()
  async delete(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    return await this.idpProviderService.delete(name)
  }

  /** Deletes an idp provider */
  @Put(':name')
  @ApiCreatedResponse()
  async update(
    @Param('name') name: string,
    @Body() idpProvider: IdpProviderDTO,
  ): Promise<[number, IdpRestriction[]] | null> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!idpProvider) {
      throw new BadRequestException('idpProvider object must be provided')
    }

    return await this.idpProviderService.update(idpProvider, name)
  }
}
