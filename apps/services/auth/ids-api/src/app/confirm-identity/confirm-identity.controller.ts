import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  VERSION_NEUTRAL,
  Param,
} from '@nestjs/common'
import { IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { Documentation } from '@island.is/nest/swagger'
import { AuditService } from '@island.is/nest/audit'
import {
  ConfirmIdentityInputDto,
  IdentityConfirmationDTO,
  IdentityConfirmationService,
} from '@island.is/auth-api-lib'
import { ApiTags } from '@nestjs/swagger'

const namespace = '@island.is/auth/confirm-identity'

@UseGuards(IdsUserGuard)
@Scopes('@identityserver.api/authentication')
@ApiTags('confirm-identity')
@Controller({
  path: 'confirm-identity',
  version: ['1', VERSION_NEUTRAL],
})
export class ConfirmIdentityController {
  constructor(
    private readonly auditService: AuditService,
    private readonly identityConfirmationService: IdentityConfirmationService,
  ) {}

  @Post()
  @Documentation({
    response: {
      status: 200,
    },
  })
  async confirmIdentity(@Body() { id, nationalId }: ConfirmIdentityInputDto) {
    await this.auditService.auditPromise<string>(
      {
        system: true,
        namespace,
        action: 'confirmIdentity',
        meta: {
          id: id,
          type: nationalId,
        },
        resources: (res) => {
          return `${res}`
        },
      },
      this.identityConfirmationService.confirmIdentity(id, nationalId),
    )
  }

  @Get(':id')
  @Documentation({
    response: {
      status: 200,
    },
    request: {
      params: {
        id: {
          required: true,
          description: 'The id of the identity confirmation',
        },
      },
    },
  })
  async getIdentityConfirmation(@Param('id') id: string) {
    await this.auditService.auditPromise<IdentityConfirmationDTO>(
      {
        system: true,
        namespace,
        action: 'getIdentityConfirmation',
        meta: {
          id: id,
        },
        resources: (res) => {
          return `${res}`
        },
      },
      this.identityConfirmationService.getIdentityConfirmation(id),
    )
  }
}
