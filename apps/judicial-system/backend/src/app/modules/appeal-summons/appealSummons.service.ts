import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealEventType,
  AppealSummonsAction,
  AppealSummonsAppellantSide,
  canPerformAppealSummonsAction,
  DocumentDeliveryReceiverType,
  DocumentDeliverySupplementCode,
  isVerdictInfoChanged,
  PoliceFileTypeCode,
  type User,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { getCaseFileHash } from '../../formatters'
import { queueMessagesAfterCommit } from '../../middleware'
import { standingVerdictAppellants } from '../appeal-case'
import { AwsS3Service } from '../aws-s3'
import { PdfService } from '../case'
import { PoliceService } from '../police'
import {
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  AppealSummonsServiceRecipient,
  Case,
  CaseRepositoryService,
} from '../repository'
import { CreateAppealSummonsDto } from './dto/createAppealSummons.dto'
import { PoliceUpdateAppealSummonsServiceDto } from './dto/policeUpdateAppealSummonsService.dto'
import { PreviewAppealSummonsDto } from './dto/previewAppealSummons.dto'
import { SendAppealSummonsToServiceDto } from './dto/sendAppealSummonsToService.dto'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class AppealSummonsService {
  constructor(
    private readonly appealSummonsRepositoryService: AppealSummonsRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly pdfService: PdfService,
    private readonly awsS3Service: AwsS3Service,
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private appealSummonsPdfKey(caseId: string, summonsId: string): string {
    return `${caseId}/appealSummons/${summonsId}.pdf`
  }

  // Same key as pdf.service getAppealSummonsPdf. deleteObject already
  // tolerates a missing object the way case-file deletes do.
  private async tryDeleteCachedPdf(theCase: Case, summonsId: string) {
    await this.awsS3Service.deleteObject(
      theCase.type,
      this.appealSummonsPdfKey(theCase.id, summonsId),
    )
  }

  // Edit clears the hash then deletes S3 after commit. A confirmation that
  // lands between those steps would upload a new PDF and set a hash; skip the
  // delete so we do not remove that object.
  private async tryDeleteCachedPdfIfUnconfirmed(
    theCase: Case,
    summonsId: string,
  ) {
    const current = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summonsId,
      theCase.id,
    )

    if (current?.hash) {
      return
    }

    await this.tryDeleteCachedPdf(theCase, summonsId)
  }

  async create(
    theCase: Case,
    dto: CreateAppealSummonsDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    this.logger.debug(
      `Creating an appeal summons for case ${theCase.id} and appeal case ${appealCase.id}`,
    )

    const resolvedDefendants = this.resolveDefendants(theCase, dto)

    const summons = await this.appealSummonsRepositoryService.create(
      { caseId: theCase.id, appealCaseId: appealCase.id },
      { transaction },
    )

    for (const defendant of resolvedDefendants) {
      await this.appealSummonsRepositoryService.createDefendant(
        {
          appealSummonsId: summons.id,
          defendantId: defendant.defendantId,
          appellantSide: defendant.appellantSide,
          claims: defendant.claims,
        },
        { transaction },
      )
    }

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_ISSUED,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    const created = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!created) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after create`,
      )
    }

    return created
  }

  async update(
    theCase: Case,
    summons: AppealSummons,
    dto: CreateAppealSummonsDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.EDIT, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot edit appeal summons ${summons.id}`,
      )
    }

    const resolvedDefendants = this.resolveDefendants(theCase, dto, summons)

    if (summons.confirmedDate) {
      await this.appealSummonsRepositoryService.update(
        summons.id,
        theCase.id,
        {
          confirmedById: null,
          confirmedDate: null,
          hash: null,
          hashAlgorithm: null,
        },
        // Do not clear confirmation if a concurrent send already went through.
        { transaction, where: { sentToCourtOfAppealsDate: null } },
      )
      // Delete after commit so a rolled-back edit cannot leave the DB hash
      // pointing at a PDF that S3 already removed. Re-check hash so a
      // confirmation that finished in between is not wiped. Catch cleanup
      // failures: the edit is already committed and must not fail the request.
      transaction.afterCommit(async () => {
        try {
          await this.tryDeleteCachedPdfIfUnconfirmed(theCase, summons.id)
        } catch (reason) {
          this.logger.error(
            `Failed to delete cached appeal summons PDF for ${summons.id} after edit`,
            { reason },
          )
        }
      })
    }

    await this.appealSummonsRepositoryService.deleteDefendants(summons.id, {
      transaction,
    })

    for (const defendant of resolvedDefendants) {
      await this.appealSummonsRepositoryService.createDefendant(
        {
          appealSummonsId: summons.id,
          defendantId: defendant.defendantId,
          appellantSide: defendant.appellantSide,
          claims: defendant.claims,
        },
        { transaction },
      )
    }

    const updated = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!updated) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after update`,
      )
    }

    return updated
  }

  async delete(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<boolean> {
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.DELETE, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot delete appeal summons ${summons.id}`,
      )
    }

    const deleted = await this.appealSummonsRepositoryService.delete(
      summons.id,
      theCase.id,
      // Do not delete if a concurrent send already went through.
      { transaction, where: { sentToCourtOfAppealsDate: null } },
    )

    if (deleted) {
      // Same as update: only drop the cached PDF once the row is gone.
      transaction.afterCommit(async () => {
        try {
          await this.tryDeleteCachedPdf(theCase, summons.id)
        } catch (reason) {
          this.logger.error(
            `Failed to delete cached appeal summons PDF for ${summons.id} after delete`,
            { reason },
          )
        }
      })
    }

    return deleted
  }

  async confirm(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.CONFIRM, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot confirm appeal summons ${summons.id}`,
      )
    }

    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const confirmedDate = new Date()

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      {
        confirmedById: user.id,
        confirmedDate,
      },
      { transaction },
    )

    const confirmed =
      await this.appealSummonsRepositoryService.findByIdAndCaseId(
        summons.id,
        theCase.id,
        { transaction },
      )

    if (!confirmed) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after confirm`,
      )
    }

    // Generate without caching: upload only after commit so a rolled-back
    // confirmation cannot leave a confirmed PDF in S3. Hash stays in-tx.
    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      confirmed,
      undefined,
      { cacheInS3: false },
    )
    const { hash, hashAlgorithm } = getCaseFileHash(pdf)

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      { hash, hashAlgorithm },
      { transaction },
    )

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_CONFIRMED,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    const result = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!result) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after hashing`,
      )
    }

    transaction.afterCommit(async () => {
      try {
        await this.pdfService.uploadAppealSummonsPdf(theCase, summons.id, pdf)
      } catch (reason) {
        this.logger.error(
          `Failed to upload confirmed appeal summons PDF for ${summons.id} after confirm`,
          { reason },
        )
      }
    })

    return result
  }

  async sendToService(
    theCase: Case,
    summons: AppealSummons,
    dto: SendAppealSummonsToServiceDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(
        AppealSummonsAction.SEND_TO_SERVICE,
        summons,
        user,
      )
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot send appeal summons ${summons.id} to service`,
      )
    }

    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const existingServices = summons.services ?? []
    const sentToServiceDate = new Date()
    const createdServices: AppealSummonsServiceRecipient[] = []

    for (const recipient of dto.recipients) {
      const hasDefendant = Boolean(recipient.defendantId)
      const hasCivilClaimant = Boolean(recipient.civilClaimantId)

      if (hasDefendant === hasCivilClaimant) {
        throw new BadRequestException(
          'Exactly one of defendantId and civilClaimantId must be set per recipient',
        )
      }

      if (recipient.defendantId) {
        const onSummons = summons.defendants?.some(
          (defendant) => defendant.defendantId === recipient.defendantId,
        )

        if (!onSummons) {
          throw new BadRequestException(
            `Defendant ${recipient.defendantId} is not on appeal summons ${summons.id}`,
          )
        }

        const alreadySent = [...existingServices, ...createdServices].some(
          (service) => service.defendantId === recipient.defendantId,
        )

        if (alreadySent) {
          continue
        }

        const defendant = theCase.defendants?.find(
          (item) => item.id === recipient.defendantId,
        )

        if (!defendant) {
          throw new BadRequestException(
            `Defendant ${recipient.defendantId} is not on case ${theCase.id}`,
          )
        }

        if (defendant.noNationalId || !defendant.nationalId) {
          throw new BadRequestException(
            `National id is required for defendant ${recipient.defendantId} when sending appeal summons ${summons.id} to service`,
          )
        }

        createdServices.push(
          await this.appealSummonsRepositoryService.createServiceRecipient(
            {
              appealSummonsId: summons.id,
              defendantId: recipient.defendantId,
              sentToServiceDate,
            },
            { transaction },
          ),
        )
      } else if (recipient.civilClaimantId) {
        const civilClaimant = theCase.civilClaimants?.find(
          (claimant) => claimant.id === recipient.civilClaimantId,
        )

        if (!civilClaimant) {
          throw new BadRequestException(
            `Civil claimant ${recipient.civilClaimantId} is not on case ${theCase.id}`,
          )
        }

        const alreadySent = [...existingServices, ...createdServices].some(
          (service) => service.civilClaimantId === recipient.civilClaimantId,
        )

        if (alreadySent) {
          continue
        }

        if (civilClaimant.noNationalId || !civilClaimant.nationalId) {
          throw new BadRequestException(
            `National id is required for civil claimant ${recipient.civilClaimantId} when sending appeal summons ${summons.id} to service`,
          )
        }

        createdServices.push(
          await this.appealSummonsRepositoryService.createServiceRecipient(
            {
              appealSummonsId: summons.id,
              civilClaimantId: recipient.civilClaimantId,
              sentToServiceDate,
            },
            { transaction },
          ),
        )
      }
    }

    if (createdServices.length === 0) {
      throw new BadRequestException(
        `No new recipients to send for appeal summons ${summons.id}`,
      )
    }

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_SENT_TO_SERVICE,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    for (const service of createdServices) {
      queueMessagesAfterCommit({
        type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_SUMMONS,
        user,
        caseId: theCase.id,
        elementId: [summons.id, service.id],
      })
    }

    const result = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!result) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after send to service`,
      )
    }

    return result
  }

  async deliverAppealSummonsToNationalCommissionersOffice({
    theCase,
    summons,
    service,
    user,
    transaction,
  }: {
    theCase: Case
    summons: AppealSummons
    service: AppealSummonsServiceRecipient
    user: User
    transaction: Transaction
  }): Promise<DeliverResponse> {
    // Lock before the idempotency check so concurrent deliveries for the same
    // service row serialize and only one CreateDocument runs.
    const lockedService =
      await this.appealSummonsRepositoryService.findServiceRecipientById(
        service.id,
        summons.id,
        { transaction, lock: true },
      )

    if (!lockedService) {
      throw new NotFoundException(
        `Appeal summons service ${service.id} not found for summons ${summons.id}`,
      )
    }

    if (lockedService.externalPoliceDocumentId) {
      return { delivered: true }
    }

    const receiver =
      lockedService.defendantId !== undefined &&
      lockedService.defendantId !== null
        ? theCase.defendants?.find(
            (defendant) => defendant.id === lockedService.defendantId,
          )
        : theCase.civilClaimants?.find(
            (claimant) => claimant.id === lockedService.civilClaimantId,
          )

    if (!receiver) {
      throw new NotFoundException(
        `Recipient for appeal summons service ${lockedService.id} not found on case ${theCase.id}`,
      )
    }

    if (receiver.noNationalId || !receiver.nationalId) {
      throw new BadRequestException(
        `National id is required for recipient when delivering appeal summons ${summons.id} to national commissioners office`,
      )
    }

    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      summons,
    )

    const documentName = `Áfrýjunarstefna í máli ${theCase.courtCaseNumber}`
    const orderByDate = new Date(lockedService.sentToServiceDate)
    orderByDate.setMonth(orderByDate.getMonth() + 2)

    const originalAncestorCaseId =
      await this.caseRepositoryService.findOriginalAncestorId(theCase)

    const receiverType = lockedService.defendantId
      ? DocumentDeliveryReceiverType.DEFENDANT
      : DocumentDeliveryReceiverType.CIVIL_CLAIMANT

    const policeCaseNumbers = theCase.policeCaseNumbers?.filter(Boolean) ?? []

    const createdDocument = await this.policeService.createDocument({
      caseId: theCase.id,
      defendantId: receiver.id,
      user,
      documentName,
      documentFiles: [
        {
          name: `${documentName}.pdf`,
          documentBase64: Base64.btoa(pdf.toString('binary')),
        },
      ],
      documentDates: [
        { code: 'ORDER_BY_DATE', value: orderByDate },
        ...(theCase.rulingDate
          ? [{ code: 'RULING_DATE', value: theCase.rulingDate }]
          : []),
      ],
      fileTypeCode: PoliceFileTypeCode.APPEAL_SUMMONS,
      caseSupplements: [
        { code: 'RVG_CASE_ID', value: originalAncestorCaseId },
        { code: 'RVG_DOCUMENT_ID', value: lockedService.id },
        { code: 'RECEIVER_SSN', value: receiver.nationalId },
        {
          code: DocumentDeliverySupplementCode.RECEIVER_TYPE,
          value: receiverType,
        },
        ...(theCase.courtCaseNumber
          ? [
              {
                code: 'VERDICT_COURT_CASE_NUMBER',
                value: theCase.courtCaseNumber,
              },
            ]
          : []),
        ...(policeCaseNumbers.length
          ? [
              {
                code: 'POLICE_CASE_NUMBERS',
                value: policeCaseNumbers.join(','),
              },
            ]
          : []),
        ...(theCase.prosecutorsOffice?.name
          ? [
              {
                code: 'PROSECUTOR_OFFICE',
                value: theCase.prosecutorsOffice.name,
              },
            ]
          : []),
      ],
    })

    await this.appealSummonsRepositoryService.updateServiceRecipient(
      lockedService.id,
      summons.id,
      { externalPoliceDocumentId: createdDocument.externalPoliceDocumentId },
      { transaction },
    )

    return { delivered: true }
  }

  async sendToCourtOfAppeals(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(
        AppealSummonsAction.SEND_TO_COURT_OF_APPEALS,
        summons,
        user,
      )
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot send appeal summons ${summons.id} to the court of appeals`,
      )
    }

    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const sentToCourtOfAppealsDate = new Date()

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      { sentToCourtOfAppealsDate },
      // Reject if already sent, or if a concurrent edit cleared confirmation.
      {
        transaction,
        where: {
          sentToCourtOfAppealsDate: null,
          confirmedDate: summons.confirmedDate ?? null,
        },
      },
    )

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    queueMessagesAfterCommit({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: {
        type: AppealCaseNotificationType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
      },
    })

    const result = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!result) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after send to court of appeals`,
      )
    }

    return result
  }

  async resolvePreviewDefendants(
    theCase: Case,
    dto: PreviewAppealSummonsDto,
  ): Promise<
    {
      defendantId: string
      appellantSide: AppealSummonsAppellantSide
      claims: string
    }[]
  > {
    let existingSummons: AppealSummons | undefined

    if (dto.appealSummonsId) {
      const summons =
        await this.appealSummonsRepositoryService.findByIdAndCaseId(
          dto.appealSummonsId,
          theCase.id,
        )

      if (!summons) {
        throw new BadRequestException(
          `Appeal summons ${dto.appealSummonsId} not found for case ${theCase.id}`,
        )
      }

      existingSummons = summons
    }

    return this.resolveDefendants(theCase, dto, existingSummons)
  }

  resolveDefendants(
    theCase: Case,
    dto: Pick<CreateAppealSummonsDto, 'defendants'>,
    // On update/preview of an existing summons, defendants already on it may
    // be kept even if their appeal was later withdrawn.
    existingSummons?: Pick<AppealSummons, 'defendants'>,
  ): {
    defendantId: string
    appellantSide: AppealSummonsAppellantSide
    claims: string
  }[] {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const standing = standingVerdictAppellants(appealCase)
    const existingByDefendant = new Map(
      (existingSummons?.defendants ?? []).map((row) => [row.defendantId, row]),
    )
    const defendantIds = dto.defendants.map(
      (defendant) => defendant.defendantId,
    )

    if (new Set(defendantIds).size !== defendantIds.length) {
      throw new BadRequestException(
        'An appeal summons cannot include the same defendant twice',
      )
    }

    return dto.defendants.map((defendant) => {
      const onCase = theCase.defendants?.some(
        (item) => item.id === defendant.defendantId,
      )

      if (!onCase) {
        throw new BadRequestException(
          `Defendant ${defendant.defendantId} is not on case ${theCase.id}`,
        )
      }

      const sides = standing
        .filter((appellant) => appellant.defendantId === defendant.defendantId)
        .map((appellant) => appellant.side)

      if (sides.length === 0) {
        const existing = existingByDefendant.get(defendant.defendantId)

        if (!existing) {
          throw new BadRequestException(
            `Defendant ${defendant.defendantId} has no standing verdict appeal`,
          )
        }

        return {
          defendantId: defendant.defendantId,
          appellantSide: existing.appellantSide,
          claims: defendant.claims,
        }
      }

      const appellantSide =
        sides.length > 1 ||
        sides.includes(AppealSummonsAppellantSide.PROSECUTION)
          ? AppealSummonsAppellantSide.PROSECUTION
          : AppealSummonsAppellantSide.DEFENCE

      return {
        defendantId: defendant.defendantId,
        appellantSide,
        claims: defendant.claims,
      }
    })
  }

  async findServiceRecipientByExternalPoliceDocumentId(
    externalPoliceDocumentId: string,
  ): Promise<AppealSummonsServiceRecipient> {
    const service =
      await this.appealSummonsRepositoryService.findServiceRecipientByExternalPoliceDocumentId(
        externalPoliceDocumentId,
      )

    if (!service) {
      throw new NotFoundException(
        `Appeal summons service with police document id ${externalPoliceDocumentId} does not exist`,
      )
    }

    return service
  }

  async updatePoliceDelivery(
    service: AppealSummonsServiceRecipient,
    update: PoliceUpdateAppealSummonsServiceDto,
    transaction: Transaction,
  ): Promise<AppealSummonsServiceRecipient> {
    return this.appealSummonsRepositoryService.updateServiceRecipient(
      service.id,
      service.appealSummonsId,
      {
        serviceStatus: update.serviceStatus,
        serviceDate: update.serviceDate,
        servedBy: update.servedBy,
        comment: update.comment,
      },
      { transaction },
    )
  }

  async syncServiceStatusesForCase(
    theCase: Case,
    user: User,
    getTransaction: () => Promise<Transaction>,
  ): Promise<AppealSummons[]> {
    const pulls: Array<{
      summons: AppealSummons
      service: AppealSummonsServiceRecipient
      update: {
        serviceStatus?: VerdictServiceStatus
        serviceDate?: Date
        servedBy?: string
        comment?: string
      }
    }> = []

    for (const summons of theCase.verdictAppealCase?.appealSummonses ?? []) {
      for (const service of summons.services ?? []) {
        if (!service.externalPoliceDocumentId || service.serviceStatus) {
          continue
        }

        let policeInfo
        try {
          policeInfo = await this.policeService.getVerdictDocumentStatus(
            service.externalPoliceDocumentId,
            user,
          )
        } catch (reason) {
          // One LOKE failure must not abort the other waiting rows or spam
          // the Overview with a toast on every load.
          this.logger.warn(
            `Failed to sync status of appeal summons service ${service.id}`,
            { reason },
          )
          continue
        }

        if (!isVerdictInfoChanged(policeInfo, service)) {
          continue
        }

        pulls.push({
          summons,
          service,
          update: {
            serviceStatus: policeInfo.serviceStatus,
            serviceDate: policeInfo.serviceDate,
            servedBy: policeInfo.servedBy,
            comment: policeInfo.comment,
          },
        })
      }
    }

    if (pulls.length === 0) {
      return []
    }

    // Opened only after the LOKE round-trips so the write window stays short.
    // CaseExistsGuard does not claim a request transaction, so this is the
    // first getOrCreateTransaction call on the route.
    const transaction = await getTransaction()
    const updatedSummonsIds = new Set<string>()

    for (const pull of pulls) {
      await this.appealSummonsRepositoryService.updateServiceRecipient(
        pull.service.id,
        pull.summons.id,
        pull.update,
        { transaction },
      )
      updatedSummonsIds.add(pull.summons.id)
    }

    const results: AppealSummons[] = []

    for (const summonsId of updatedSummonsIds) {
      const reloaded =
        await this.appealSummonsRepositoryService.findByIdAndCaseId(
          summonsId,
          theCase.id,
          { transaction },
        )

      if (reloaded) {
        results.push(reloaded)
      }
    }

    return results
  }
}
