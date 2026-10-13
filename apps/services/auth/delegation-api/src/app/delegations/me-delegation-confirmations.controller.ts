import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  DelegationConfirmationAuthenticationDTO,
  DelegationConfirmationService,
  DelegationsOutgoingService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { delegationScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import type { DocumentationParamOptions } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/delegation-api/me/delegation-confirmations'

const confirmationId: DocumentationParamOptions = {
  required: true,
  type: 'string',
  format: 'uuid',
  description: 'The id of the delegation confirmation.',
}

/** Not flag gated, so turning the flag off never strands a grant already waiting. */
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...delegationScopes)
@ApiSecurity('ias', delegationScopes)
@ApiTags('me/delegation-confirmations')
@Controller({
  path: 'me/delegation-confirmations',
  version: ['1'],
})
@Audit({ namespace })
export class MeDelegationConfirmationsController {
  constructor(
    private readonly delegationConfirmationService: DelegationConfirmationService,
    private readonly delegationsOutgoingService: DelegationsOutgoingService,
    private readonly auditService: AuditService,
  ) {}

  @Get(':confirmationId/authentication')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationConfirmationAuthenticationDTO },
    request: { params: { confirmationId } },
  })
  async getAuthentication(
    @CurrentUser() user: User,
    @Param('confirmationId', new ParseUUIDPipe()) id: string,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    const { status, completedNow } =
      await this.delegationConfirmationService.getAuthenticationStatus(user, id)

    // Only the poll that completes it audits and notifies, however often the client polls.
    for (const { confirmation: confirmed } of completedNow ?? []) {
      this.auditService.audit({
        auth: user,
        action: 'confirm',
        namespace,
        resources: confirmed.id,
        meta: {
          delegationId: confirmed.delegationId,
          toNationalId: confirmed.toNationalId,
          groupId: confirmed.groupId,
          contentHash: confirmed.contentHash,
          acr: confirmed.acr,
          amr: confirmed.amr,
          scopes: confirmed.scopes.map((scope) => scope.name),
        },
      })
    }

    if (completedNow?.length) {
      void this.delegationsOutgoingService.notifyConfirmed(
        user,
        completedNow.flatMap(({ confirmation, hadExistingScopes }) =>
          confirmation.delegationId
            ? [{ delegationId: confirmation.delegationId, hadExistingScopes }]
            : [],
        ),
      )
    }

    return new DelegationConfirmationAuthenticationDTO(status)
  }
}
