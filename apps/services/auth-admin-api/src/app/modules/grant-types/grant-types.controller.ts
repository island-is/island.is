import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  GrantType,
  GrantTypeService,
  GrantTypeDTO,
} from '@island.is/auth-api-lib'
import { Scopes } from '@island.is/auth-nest-tools'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('grants')
@Controller('backend/grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

  /** Gets all Grant Types */
  @Get()
  @ApiOkResponse({ type: [GrantType] })
  async findAll(): Promise<GrantType[] | null> {
    const grantTypes = await this.grantTypeService.findAll()
    return grantTypes
  }

  /** Gets all idp restrictions and count of rows */
  @Get('search')
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
              items: { $ref: getSchemaPath(GrantType) },
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
  ): Promise<{ rows: GrantType[]; count: number } | null> {
    if (searchString) {
      const idps = await this.grantTypeService.find(searchString, page, count)
      return idps
    } else {
      const idps = await this.grantTypeService.findAndCountAll(page, count)
      return idps
    }
  }

  /** Gets a grant type by name */
  @Scopes('@identityserver.api/authentication')
  @Get('type/:name')
  @ApiOkResponse({ type: GrantType })
  async getGrantType(@Param('name') name: string): Promise<GrantType | null> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const grantType = await this.grantTypeService.getGrantType(name)

    if (!grantType) {
      throw new NotFoundException("This particular grantType doesn't exist")
    }

    return grantType
  }

  /** Creates a new grant type */
  @Scopes('@identityserver.api/authentication')
  @Post()
  @ApiOkResponse({ type: GrantType })
  async createGrantType(
    @Body() grantType: GrantTypeDTO,
  ): Promise<GrantType | null> {
    if (!grantType) {
      throw new BadRequestException('grantType must be provided')
    }

    return this.grantTypeService.create(grantType)
  }

  /** Updates an existing grantType */
  @Scopes('@identityserver.api/authentication')
  @Put(':name')
  @ApiOkResponse({ type: GrantType })
  async updateGrantType(
    @Body() grantType: GrantTypeDTO,
    @Param('name') name: string,
  ): Promise<GrantType | null> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    if (!grantType) {
      throw new BadRequestException('grantType must be provided')
    }

    return this.grantTypeService.update(grantType, name)
  }

  /** Soft deletes a grant type */
  @Scopes('@identityserver.api/authentication')
  @Delete(':name')
  @ApiOkResponse({ type: Number })
  async deleteGrantType(@Param('name') name: string): Promise<number | null> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }
    return this.grantTypeService.delete(name)
  }
}
