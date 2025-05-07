import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { EmailsService } from './emails.service'
import { Documentation } from '@island.is/nest/swagger'
import { EmailsDto } from './dto/emails.dto'
import { UserProfileScope } from '@island.is/auth/scopes'
import { VerificationService } from '../user-profile/verification.service'
import { CreateEmailDto } from './dto/create-emails.dto'

const namespace = '@island.is/user-profile/v2/emails'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UserProfileScope.read)
@ApiTags('v2/me/emails')
@ApiSecurity('oauth2', [])
@Controller({
  path: 'me/emails',
  version: ['2'],
})
@Audit({ namespace })
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly verificationService: VerificationService,
    private readonly auditService: AuditService,
  ) {}

  @Get('/')
  @Documentation({
    description: 'Get email list for national id',
    response: { status: 200, type: EmailsDto },
    request: {
      query: {
        nationalId: {
          required: true,
          type: 'string',
          description: 'National ID of the user',
        },
      },
    },
  })
  @Audit<EmailsDto[]>({
    resources: (emails) => emails.map((email) => email.id),
  })
  async findAllByNationalId(@CurrentUser() user: User): Promise<EmailsDto[]> {
    return this.emailsService.findAllByNationalId(user.nationalId)
  }

  @Post('/')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description: "Add a new email to the user's email list",
    response: { status: 200, type: EmailsDto },
  })
  async createEmail(
    @CurrentUser() user: User,
    @Body() input: CreateEmailDto,
  ): Promise<EmailsDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'createEmail',
        resources: user.nationalId,
        meta: {
          email: input.email,
        },
      },
      this.emailsService.createEmail(user.nationalId, input.email, input.code),
    )
  }

  @Delete('/:emailId')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description: "Remove an email from the user's emails list",
    response: { status: 200, type: Boolean },
    request: {
      params: {
        emailId: {
          required: true,
          type: 'string',
          description: 'ID of the email to delete',
        },
      },
    },
  })
  async deleteEmail(
    @CurrentUser() user: User,
    @Param('emailId') emailId: string,
  ): Promise<{ success: boolean }> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'deleteEmail',
        resources: [user.nationalId, emailId],
        meta: {
          emailId,
        },
      },
      this.emailsService.deleteEmail(user.nationalId, emailId),
    )
  }
}
