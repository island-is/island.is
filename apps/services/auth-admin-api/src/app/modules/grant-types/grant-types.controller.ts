import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  GrantType,
  GrantTypeService,
  Scopes,
  ScopesGuard,
  IdsAuthGuard,
} from '@island.is/auth-api-lib'

// TODO: Add guards after getting communications to work properly with IDS4
// @UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

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
