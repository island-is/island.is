import { ClaimsService, Claim } from '@island.is/auth-api-lib'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('claims')
@Controller('backend')
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
