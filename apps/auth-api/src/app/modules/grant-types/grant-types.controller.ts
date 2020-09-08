import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GrantTypeService } from './grant-types.service'
import { GrantType } from './grant-type.model'

  @ApiOAuth2(['openid:profile']) // add OAuth restriction to this controller
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
