import {
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

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

  @Scopes('@identityserver.api/authentication')
  @Get('type/:name')
  @ApiOkResponse({ type: GrantType })
  async getGrantType(@Param('name') name: string): Promise<GrantType> {
    const grantType = await this.grantTypeService.getGrantType(name)

    if (!grantType) {
      throw new NotFoundException("This particular grantType doesn't exist")
    }

    return grantType
  }
}
