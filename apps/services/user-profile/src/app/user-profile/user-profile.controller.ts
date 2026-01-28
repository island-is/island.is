import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import * as kennitala from 'kennitala'

import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { AdminPortalScope, UserProfileScope } from '@island.is/auth/scopes'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profile.dto'
import { UserProfileService } from './user-profile.service'
import { PaginatedUserProfileDto } from './dto/paginated-user-profile.dto'
import { ClientType } from '../types/ClientType'
import { ActorProfileDto } from './dto/actor-profile.dto'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { EmailsService } from './emails.service'
import { EmailsDto } from './dto/emails.dto'

const namespace = '@island.is/user-profile/v2/users'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(UserProfileScope.system, UserProfileScope.admin)
@ApiTags('v2/users')
@ApiSecurity('oauth2', [UserProfileScope.system])
@Controller({
  path: 'users',
  version: ['2'],
})
@Audit({ namespace })
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly emailsService: EmailsService,
    private readonly auditService: AuditService,
  ) {}

  @Get('/')
  @Documentation({
    description: 'Get user profiles.',
    response: { status: 200, type: PaginatedUserProfileDto },
    request: {
      query: {
        search: {
          required: true,
          type: 'string',
          description: 'Search term for user profiles',
        },
      },
    },
  })
  @ApiSecurity('oauth2', [AdminPortalScope.serviceDesk])
  @Audit<PaginatedUserProfileDto>({
    resources: (profile) => profile.data.map((p) => p.nationalId),
  })
  @Scopes(AdminPortalScope.serviceDesk)
  async findUserProfiles(
    @Query('search') search: string,
  ): Promise<PaginatedUserProfileDto> {
    return this.userProfileService.findAllBySearchTerm(search)
  }

  @Get('/.national-id')
  @Documentation({
    description: 'Get user profile for given nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user to find',
        },
      },
      query: {
        clientType: {
          required: false,
          description: 'Client type',
          enum: ClientType,
        },
      },
    },
    response: { status: 200, type: UserProfileDto },
  })
  @ApiSecurity('oauth2', [
    UserProfileScope.system,
    UserProfileScope.admin,
    AdminPortalScope.serviceDesk,
  ])
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  @Scopes(
    UserProfileScope.system,
    UserProfileScope.admin,
    AdminPortalScope.serviceDesk,
  )
  async findUserProfile(
    @Headers('X-Param-National-Id') nationalId: string,
    @Query('clientType') clientType: ClientType = ClientType.THIRD_PARTY,
  ): Promise<UserProfileDto> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('National id is not valid')
    }
    return this.userProfileService.findById(nationalId, false, clientType)
  }

  @Get('/.to-national-id/actor-profiles/.from-national-id')
  @Documentation({
    description: 'Get actor profiles for nationalId.',
    request: {
      header: {
        'X-Param-To-National-Id': {
          required: true,
          description: 'National id of the user the actor profile is for',
        },
        'X-Param-From-National-Id': {
          required: true,
          description: 'National id of the user the delegation is from',
        },
      },
    },
    response: { status: 200, type: ActorProfileDto },
  })
  @Audit<ActorProfileDto>({
    resources: (profile) => profile.fromNationalId,
  })
  async getActorProfile(
    @Headers('X-Param-To-National-Id') toNationalId: string,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
  ): Promise<ActorProfileDto> {
    if (
      !kennitala.isValid(toNationalId) ||
      !kennitala.isValid(fromNationalId)
    ) {
      throw new BadRequestException('National id is not valid')
    }

    return this.userProfileService.getActorProfile({
      toNationalId,
      fromNationalId,
    })
  }

  @Patch('/.national-id')
  @Documentation({
    description: 'Update user profile for given nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user to update',
        },
      },
    },
    response: { status: 200, type: UserProfileDto },
  })
  @ApiSecurity('oauth2', [AdminPortalScope.serviceDesk])
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  @Scopes(AdminPortalScope.serviceDesk)
  patchUserProfile(
    @Headers('X-Param-National-Id') nationalId: string,
    @Body() userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.userProfileService.patch(
      {
        nationalId,
      },
      userProfile,
    )
  }

  @Get('/.national-id/emails')
  @Documentation({
    description: 'Get all emails for a user by nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user',
        },
      },
    },
    response: { status: 200, type: [EmailsDto] },
  })
  @ApiSecurity('oauth2', [AdminPortalScope.serviceDesk])
  @Audit<EmailsDto[]>({
    resources: (emails) => emails.map((email) => email.id),
  })
  @Scopes(AdminPortalScope.serviceDesk)
  async getUserEmails(
    @Headers('X-Param-National-Id') nationalId: string,
  ): Promise<EmailsDto[]> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('National id is not valid')
    }

    return this.emailsService.findAllByNationalId(nationalId)
  }

  @Delete('/.national-id/emails/:emailId')
  @Documentation({
    description: 'Delete an email for a user by nationalId and emailId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user',
        },
      },
      params: {
        emailId: {
          required: true,
          type: 'string',
          description: 'ID of the email to delete',
        },
      },
    },
    response: { status: 200, type: Boolean },
  })
  @ApiSecurity('oauth2', [AdminPortalScope.serviceDesk])
  @Audit<boolean>({
    action: 'deleteEmail',
    resources: () => [],
  })
  @Scopes(AdminPortalScope.serviceDesk)
  async deleteEmail(
    @Headers('X-Param-National-Id') nationalId: string,
    @Param('emailId') emailId: string,
  ): Promise<boolean> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('National id is not valid')
    }

    return this.emailsService.deleteEmail(nationalId, emailId)
  }
}
