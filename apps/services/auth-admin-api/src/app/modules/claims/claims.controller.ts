import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthAdminScope } from '@island.is/auth/scopes'
import { Claim,ClaimsService } from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes,ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import { environment } from '../../../environments/'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('claims')
@Controller('backend')
@Audit({ namespace: `${environment.audit.defaultNamespace}/claims` })
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /** Gets all Claims */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('claims')
  @ApiOkResponse({ type: Claim, isArray: true })
  @Audit<Claim[]>({
    resources: (claims) => claims.map((claim) => claim.id),
  })
  async findAll(): Promise<Claim[]> {
    return this.claimsService.findAll()
  }
}
