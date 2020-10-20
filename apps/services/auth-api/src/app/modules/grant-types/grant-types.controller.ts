import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import {
  GrantType,
  GrantTypeService,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-api-lib'

@UseGuards(AuthGuard('jwt'), ScopesGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

  @Scopes('@identityserver.api/authentication')
  @Get('type/:id')
  @ApiOkResponse({ type: GrantType })
  async getGrantType(@Param('id') id: string): Promise<GrantType> {
    const grantType = await this.grantTypeService.getGrantType(id)

    if (!grantType) {
      throw new NotFoundException("This particular grantType doesn't exist")
    }

    return grantType
  }
}
