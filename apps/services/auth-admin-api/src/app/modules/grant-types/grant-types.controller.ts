import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { GrantType, GrantTypeService } from '@island.is/auth-api-lib'
import { Scopes } from '@island.is/auth-nest-tools'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

  /** Gets all Grant Types */
  @Get()
  @ApiOkResponse({ type: [GrantType] })
  async findAll(): Promise<GrantType[] | null> {
    const grantTypes = await this.grantTypeService.findAll()
    return grantTypes
  }

  /** Gets a grant type by name */
  @Scopes('@identityserver.api/authentication')
  @Get('type/:name')
  @ApiOkResponse({ type: GrantType })
  async getGrantType(@Param('name') name: string): Promise<GrantType> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const grantType = await this.grantTypeService.getGrantType(name)

    if (!grantType) {
      throw new NotFoundException("This particular grantType doesn't exist")
    }

    return grantType
  }
}
