import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

@UseGuards(IdsAuthGuard, ScopesGuard)
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
    return this.emailsService.createEmail(
      user.nationalId,
      input.email,
      input.code,
    )
  }
}
