import {
  Body,
  Controller,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Documentation } from '@island.is/nest/swagger'
import { AuditService } from '@island.is/nest/audit'
import {
  ConfirmIdentityInputDto,
  IdentityConfirmationService,
} from '@island.is/auth-api-lib'
import { ApiTags } from '@nestjs/swagger'

const namespace = '@island.is/auth/confirm-identity'

@UseGuards(IdsUserGuard)
@ApiTags('confirm-identity')
@Controller({ path: 'confirm-identity', version: ['1', VERSION_NEUTRAL] })
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
}
