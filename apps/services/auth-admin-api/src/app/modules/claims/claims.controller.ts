import { ClaimsService, Claim } from '@island.is/auth-api-lib'
import { Controller, Get } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// TODO: Add guards when functional
// @UseGuards(AuthGuard('jwt'))
@ApiTags('claims')
@Controller()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /** Gets all Claims */
  @Get('claims')
  @ApiOkResponse({ type: Claim, isArray: true })
  async findAll(): Promise<Claim[] | null> {
    const claimsPaging = await this.claimsService.findAll()
    return claimsPaging
  }
}
