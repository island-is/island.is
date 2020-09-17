import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GrantType, GrantTypeService } from '@island.is/auth-api'

@ApiOAuth2(['openid:profile'])
@UseGuards(AuthGuard('jwt'))
@ApiTags('grants')
@Controller('grants')
export class GrantTypeController {
  constructor(private readonly grantTypeService: GrantTypeService) {}

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
