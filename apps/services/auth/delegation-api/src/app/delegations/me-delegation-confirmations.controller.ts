import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  DelegationConfirmationAuthenticationDTO,
  DelegationConfirmationDTO,
  DelegationConfirmationReceiptDTO,
  DelegationConfirmationService,
  DelegationsOutgoingService,
  StartDelegationConfirmationAuthenticationDTO,
  StartedDelegationConfirmationAuthenticationDTO,
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

/**
 * Second half of "tvöfalt samþykki": completing a delegation whose sensitive
 * scopes were held pending a fresh, high-assurance authentication.
 *
 * Deliberately NOT feature-flag gated. Only the *creation* of confirmations is
 * flagged; if the flag were to gate this endpoint too, turning it off would
 * strand grants that are already awaiting confirmation.
 */
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

  @Get()
  @Documentation({
    response: { status: 200, type: [DelegationConfirmationDTO] },
  })
  @Audit<DelegationConfirmationDTO[]>({
    resources: (confirmations) => confirmations.map((c) => c.id),
  })
  async findAll(
    @CurrentUser() user: User,
  ): Promise<DelegationConfirmationDTO[]> {
    const confirmations =
      await this.delegationConfirmationService.findAllForUser(user)

    return confirmations.map(
      (confirmation) => new DelegationConfirmationDTO(confirmation),
    )
  }

  @Get(':confirmationId')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationConfirmationDTO },
    request: { params: { confirmationId } },
  })
  @Audit<DelegationConfirmationDTO>({
    resources: (confirmation) => confirmation.id,
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('confirmationId') id: string,
  ): Promise<DelegationConfirmationDTO> {
    const confirmation =
      await this.delegationConfirmationService.findByIdForUser(user, id)

    return new DelegationConfirmationDTO(confirmation)
  }

  @Get(':confirmationId/receipt')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationConfirmationReceiptDTO },
    request: { params: { confirmationId } },
  })
  @Audit<DelegationConfirmationReceiptDTO>({
    resources: (receipt) => receipt.confirmationId,
  })
  async findReceipt(
    @CurrentUser() user: User,
    @Param('confirmationId') id: string,
  ): Promise<DelegationConfirmationReceiptDTO> {
    const confirmation =
      await this.delegationConfirmationService.findConfirmedForReceipt(user, id)

    return new DelegationConfirmationReceiptDTO(confirmation)
  }

  /**
   * Starts the confirming authentication: the identity server asks Auðkenni to
   * authenticate the grantor on their phone, showing the confirmation's binding
   * message. Poll the GET endpoint for the result. The grantor may ask for the
   * other method (app or SIM); never for where it goes.
   */
  @Post(':confirmationId/authentication')
  @Documentation({
    includeNoContentResponse: true,
    response: {
      status: 200,
      type: StartedDelegationConfirmationAuthenticationDTO,
    },
    request: { params: { confirmationId } },
  })
  async startAuthentication(
    @CurrentUser() user: User,
    @Param('confirmationId') id: string,
    @Body() body?: StartDelegationConfirmationAuthenticationDTO,
  ): Promise<StartedDelegationConfirmationAuthenticationDTO> {
    const started =
      await this.delegationConfirmationService.startAuthentication(
        user,
        id,
        body?.method,
      )

    this.auditService.audit({
      auth: user,
      action: 'startAuthentication',
      namespace,
      resources: id,
      meta: { method: started.method, requested: body?.method },
    })

    return started
  }

  /**
   * Where the confirming authentication stands. Once the grantor has approved,
   * this is the call that grants the held scopes.
   */
  @Get(':confirmationId/authentication')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationConfirmationAuthenticationDTO },
    request: { params: { confirmationId } },
  })
  async getAuthentication(
    @CurrentUser() user: User,
    @Param('confirmationId') id: string,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    const { status, confirmation, completedNow } =
      await this.delegationConfirmationService.getAuthenticationStatus(user, id)

    // Only the poll that completes it is audited and notified, so a client
    // polling an already-confirmed row doesn't repeat either.
    if (completedNow) {
      this.auditService.audit({
        auth: user,
        action: 'confirm',
        namespace,
        resources: confirmation.id,
        meta: {
          delegationId: confirmation.delegationId,
          toNationalId: confirmation.toNationalId,
          contentHash: confirmation.contentHash,
          acr: confirmation.acr,
          amr: confirmation.amr,
          scopes: confirmation.scopes.map((scope) => scope.name),
        },
      })

      // The recipient is told only now, when the access actually exists.
      if (confirmation.delegationId) {
        void this.delegationsOutgoingService.notifyConfirmedDelegation(
          user,
          confirmation.delegationId,
          false,
        )
      }
    }

    return new DelegationConfirmationAuthenticationDTO(status, confirmation)
  }
}
