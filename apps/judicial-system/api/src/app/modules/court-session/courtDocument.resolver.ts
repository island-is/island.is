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
import { CourtDocumentResponse } from './dto/courtDocument.response'
import { CreateCourtDocumentInput } from './dto/createCourtDocument.input'
import { DeleteCourtDocumentInput } from './dto/deleteCourtDocument.input'
import { DeleteCourtDocumentResponse } from './dto/deleteCourtDocument.response'
import { FileCourtDocumentInCourtSessionInput } from './dto/fileCourtDocumentInCourtSession.input'
import { UpdateCourtDocumentInput } from './dto/updateCourtDocument.input'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class CourtDocumentResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CourtDocumentResponse, { nullable: true })
  createCourtDocument(
    @Args('input', { type: () => CreateCourtDocumentInput })
    input: CreateCourtDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtDocumentResponse> {
    const { caseId, courtSessionId, ...createCourtDocument } = input

    this.logger.debug(
      `Creating a new court document for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_COURT_DOCUMENT,
      backendService.createCourtDocument(
        caseId,
        courtSessionId,
        createCourtDocument,
      ),
      (theCourtDocument) => theCourtDocument.id,
    )
  }

  @Mutation(() => CourtDocumentResponse, { nullable: true })
  updateCourtDocument(
    @Args('input', { type: () => UpdateCourtDocumentInput })
    input: UpdateCourtDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtDocumentResponse> {
    const { caseId, courtSessionId, courtDocumentId, ...updateCourtDocument } =
      input

    this.logger.debug(
      `Updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_COURT_DOCUMENT,
      backendService.updateCourtDocument(
        caseId,
        courtSessionId,
        courtDocumentId,
        updateCourtDocument,
      ),
      courtDocumentId,
    )
  }

  @Mutation(() => CourtDocumentResponse)
  fileCourtDocumentInCourtSession(
    @Args('input', { type: () => FileCourtDocumentInCourtSessionInput })
    input: FileCourtDocumentInCourtSessionInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtDocumentResponse> {
    const { caseId, courtSessionId, courtDocumentId } = input

    this.logger.debug(
      `Filing court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.FILE_COURT_DOCUMENT,
      backendService.fileCourtDocumentInCourtSession(
        caseId,
        courtSessionId,
        courtDocumentId,
      ),
      courtDocumentId,
    )
  }

  @Mutation(() => DeleteCourtDocumentResponse)
  deleteCourtDocument(
    @Args('input', { type: () => DeleteCourtDocumentInput })
    input: DeleteCourtDocumentInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteCourtDocumentResponse> {
    const { caseId, courtSessionId, courtDocumentId } = input

    this.logger.debug(
      `Deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_COURT_DOCUMENT,
      backendService.deleteCourtDocument(
        caseId,
        courtSessionId,
        courtDocumentId,
      ),
      courtDocumentId,
    )
  }
}
