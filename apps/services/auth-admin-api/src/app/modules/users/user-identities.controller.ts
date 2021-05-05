import {
  UserIdentitiesService,
  UserIdentity,
  ActiveDTO,
} from '@island.is/auth-api-lib'
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('user-identities')
@Controller('backend/user-identities')
export class UserIdentitiesController {
  constructor(private readonly userIdentityService: UserIdentitiesService) {}

  /** Gets User Identity either by subject Id or National Id (kennitala) */
  @Scopes(Scope.root, Scope.full)
  @Get(':id')
  @ApiOkResponse({ type: UserIdentity })
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
    const userIdentitiesBySubject = await this.userIdentityService.findBySubjectId(
      id,
    )

    if (!userIdentitiesBySubject) {
      throw new NotFoundException("This user identity doesn't exist")
    }

    return [userIdentitiesBySubject]
  }

  @Scopes(Scope.root, Scope.full)
  @Patch(':subjectId')
  @ApiCreatedResponse({ type: UserIdentity })
  async setActive(
    @Param('subjectId') subjectId: string,
    @Body() req: ActiveDTO,
  ): Promise<UserIdentity | null> {
    if (!subjectId) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.userIdentityService.setActive(subjectId, req.active)
  }
}
