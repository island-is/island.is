import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ActiveDTO,
  UserIdentitiesService,
  UserIdentity,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { NoContentException } from '@island.is/nest/problem'

const namespace = '@island.is/auth/admin-api/v2/user-identities'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/user-identities',
  version: ['2'],
})
@Audit({ namespace })
export class MeUserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  @Get(':identifier')
  @Documentation({
    description:
      'Find user identities by national ID (10 digits) or subject ID.',
    response: { status: 200, type: [UserIdentity] },
  })
  @Audit<UserIdentity[]>({
    resources: (identities) => identities.map((identity) => identity.subjectId),
  })
  async findByIdentifier(
    @Param('identifier') identifier: string,
  ): Promise<UserIdentity[]> {
    if (!identifier) {
      throw new BadRequestException('identifier must be provided')
    }

    if (!isNaN(+identifier) && identifier.length === 10) {
      const userIdentities = await this.userIdentityService.findByNationalId(
        identifier,
      )

      if (!userIdentities) {
        throw new NotFoundException("This user identity doesn't exist")
      }

      return userIdentities
    }

    const userIdentity = await this.userIdentityService.findBySubjectId(
      identifier,
    )

    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return [userIdentity]
  }

  @Patch(':subjectId')
  @Documentation({
    description: 'Set the active flag on a user identity.',
    response: { status: 200, type: UserIdentity },
  })
  @Audit<UserIdentity>({
    resources: (identity) => identity?.subjectId,
  })
  async setActive(
    @Param('subjectId') subjectId: string,
    @Body() input: ActiveDTO,
  ): Promise<UserIdentity> {
    if (!subjectId) {
      throw new BadRequestException('subjectId must be provided')
    }

    const userIdentity = await this.userIdentityService.setActive(
      subjectId,
      input.active,
    )

    if (!userIdentity) {
      throw new NoContentException()
    }

    return userIdentity
  }
}
