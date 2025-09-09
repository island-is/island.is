import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

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

import { BackendService } from '../backend'
import { DeleteResponse } from '../indictment-count/models/delete.response'
import { CourtSessionDocumentResponse } from './dto/courtSessionDocument.response'
import { CreateCourtSessionDocumentInput } from './dto/createCourtSessionDocument.input'
import { UpdateCourtSessionDocumentInput } from './dto/updateCourtSessionDocument.input'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class CourtSessionDocumentResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CourtSessionDocumentResponse, { nullable: true })
  createCourtSessionDocument(
    @Args('input', { type: () => CreateCourtSessionDocumentInput })
    input: CreateCourtSessionDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtSessionDocumentResponse> {
    const { caseId, courtSessionId, ...createCourtSessionDocument } = input

    this.logger.debug(
      `Creating a new court session document for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_COURT_SESSION_DOCUMENT,
      backendService.createCourtSessionDocument(
        caseId,
        courtSessionId,
        createCourtSessionDocument,
      ),
      (theCourtSessionDocument) => theCourtSessionDocument.id,
    )
  }

  @Mutation(() => CourtSessionDocumentResponse, { nullable: true })
  updateCourtSessionDocument(
    @Args('input', { type: () => UpdateCourtSessionDocumentInput })
    input: UpdateCourtSessionDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtSessionDocumentResponse> {
    const {
      caseId,
      courtSessionId,
      courtSessionDocumentId,
      ...updateCourtSessionDocument
    } = input

    this.logger.debug(
      `Updating court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_COURT_SESSION_DOCUMENT,
      backendService.updateCourtSessionDocument(
        caseId,
        courtSessionId,
        courtSessionDocumentId,
        updateCourtSessionDocument,
      ),
      courtSessionDocumentId,
    )
  }

  @Mutation(() => DeleteResponse)
  deleteCourtSessionDocument(
    @Args('input', { type: () => UpdateCourtSessionDocumentInput })
    input: UpdateCourtSessionDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteResponse> {
    const { caseId, courtSessionId, courtSessionDocumentId } = input

    this.logger.debug(
      `Deleting court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_COURT_SESSION_DOCUMENT,
      backendService.deleteCourtSessionDocument(
        caseId,
        courtSessionId,
        courtSessionDocumentId,
      ),
      courtSessionDocumentId,
    )
  }
}
