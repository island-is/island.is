import { ClaimsService, Claim } from '@island.is/auth-api-lib'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('claims')
@Controller('backend')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /** Gets all Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('claims')
  @ApiOkResponse({ type: Claim, isArray: true })
  async findAll(): Promise<Claim[] | null> {
    const claimsPaging = await this.claimsService.findAll()
    return claimsPaging
  }
}
