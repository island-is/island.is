import {
  UserIdentitiesService,
  UserIdentity,
  ActiveDTO,
} from '@island.is/auth-api-lib'
import { NoContentException } from '@island.is/nest/problem'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
} from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { environment } from '../../../environments/'

const namespace = `${environment.audit.defaultNamespace}/user-identities`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'user-identities',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  /** Gets User Identity either by subject Id or National Id (kennitala) */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get(':id')
  @ApiOkResponse({ type: UserIdentity })
  @Audit<UserIdentity[]>({
    resources: (identities) => identities.map((identity) => identity.subjectId),
  })
  async findByNationalIdOrSubjectId(
    @Param('id') id: string,
  ): Promise<UserIdentity[]> {
    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    // Find by NationalId
    if (!isNaN(+id) && id.length === 10) {
      const userIdentities = await this.userIdentityService.findByNationalId(id)

      if (!userIdentities) {
        throw new NotFoundException("This user identity doesn't exist")
      }

      return userIdentities
    }

    // Find by subjectId
    const userIdentitiesBySubject =
      await this.userIdentityService.findBySubjectId(id)

    if (!userIdentitiesBySubject) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return [userIdentitiesBySubject]
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Patch(':subjectId')
  @ApiCreatedResponse({ type: UserIdentity })
  @Audit<UserIdentity>({
    resources: (identity) => identity?.subjectId,
  })
  async setActive(
    @Param('subjectId') subjectId: string,
    @Body() req: ActiveDTO,
  ): Promise<UserIdentity> {
    if (!subjectId) {
      throw new BadRequestException('Id must be provided')
    }

    const userIdentity = await this.userIdentityService.setActive(
      subjectId,
      req.active,
    )
    if (!userIdentity) {
      throw new NoContentException()
    }
    return userIdentity
  }
}
