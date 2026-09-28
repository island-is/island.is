import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import { Feature } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { FeatureService } from '../feature/feature.service'
import { CreateDefendantInput } from './dto/createDefendant.input'
import { DeleteDefendantInput } from './dto/deleteDefendant.input'
import { UpdateDefendantInput } from './dto/updateDefendant.input'
import { Defendant } from './models/defendant.model'
import { DeleteDefendantResponse } from './models/delete.response'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class DefendantResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
    private readonly featureService: FeatureService,
  ) {}

  @Mutation(() => Defendant, { nullable: true })
  createDefendant(
    @Args('input', { type: () => CreateDefendantInput })
    input: CreateDefendantInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Defendant> {
    const { caseId, ...createDefendant } = input
    this.logger.debug(`Creating a new defendant for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_DEFENDANT,
      this.backendService.createDefendant(caseId, createDefendant),
      (defendant) => defendant.id,
    )
  }

  @Mutation(() => Defendant, { nullable: true })
  updateDefendant(
    @Args('input', { type: () => UpdateDefendantInput })
    input: UpdateDefendantInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Defendant> {
    const { caseId, defendantId, ...updateDefendant } = input
    this.logger.debug(`Updating defendant ${defendantId} for case ${caseId}`)

    // For the public prosecution the review decision is the appeal, so a
    // changed decision files or withdraws one - in the same transaction as the
    // decision itself, on the backend. Whether that happens is this layer's
    // call, because the feature lives here: the backend never reads it, and an
    // environment where it is hidden simply never asks. Deliberately not part
    // of the input - a client must not be able to ask for it.
    const registersVerdictAppeal =
      updateDefendant.indictmentReviewDecision !== undefined &&
      !this.featureService.isHidden(Feature.INDICTMENT_APPEAL)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_DEFENDANT,
      this.backendService.updateDefendant(caseId, defendantId, {
        ...updateDefendant,
        ...(registersVerdictAppeal ? { registerVerdictAppeal: true } : {}),
      }),
      defendantId,
    )
  }

  @Mutation(() => DeleteDefendantResponse, { nullable: true })
  deleteDefendant(
    @Args('input', { type: () => DeleteDefendantInput })
    input: DeleteDefendantInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<DeleteDefendantResponse> {
    const { caseId, defendantId } = input
    this.logger.debug(`Deleting defendant ${defendantId} for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_DEFENDANT,
      this.backendService.deleteDefendant(caseId, defendantId),
      defendantId,
    )
  }
}
