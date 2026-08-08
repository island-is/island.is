import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import * as kennitala from 'kennitala'

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

  @Get()
  @Documentation({
    description: 'Find user identities by national ID.',
    response: { status: 200, type: [UserIdentity] },
    request: {
      header: {
        'X-Query-National-Id': {
          required: true,
          description: 'The national ID of the user identity',
        },
      },
    },
  })
  @Audit<UserIdentity[]>({
    resources: (identities) => identities.map((identity) => identity.subjectId),
  })
  async findByNationalId(
    @Headers('X-Query-National-Id') nationalId: string,
  ): Promise<UserIdentity[]> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('A valid national id must be provided')
    }

    const userIdentities = await this.userIdentityService.findByNationalId(
      nationalId,
    )

    if (!userIdentities || userIdentities.length === 0) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentities
  }

  @Get(':subjectId')
  @Documentation({
    description: 'Find a user identity by subject ID.',
    response: { status: 200, type: UserIdentity },
  })
  @Audit<UserIdentity>({
    resources: (identity) => identity?.subjectId,
  })
  async findBySubjectId(
    @Param('subjectId') subjectId: string,
  ): Promise<UserIdentity> {
    if (!subjectId) {
      throw new BadRequestException('subjectId must be provided')
    }

    const userIdentity = await this.userIdentityService.findBySubjectId(
      subjectId,
    )

    if (!userIdentity) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return userIdentity
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
