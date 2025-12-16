import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CourtSessionRulingType,
  DefendantEventType,
  isVerdictInfoChanged,
  PoliceFileTypeCode,
  type User as TUser,
} from '@island.is/judicial-system/types'
import { ServiceRequirement } from '@island.is/judicial-system/types'

import { InternalCaseService, PdfService } from '../case'
import { DefendantService } from '../defendant'
import { FileService } from '../file'
import { PoliceDocumentType, PoliceService } from '../police'
import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../repository'
import { CreateVerdictDto } from './dto/createVerdict.dto'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { PoliceUpdateVerdictDto } from './dto/policeUpdateVerdict.dto'
import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { DeliverResponse } from './models/deliver.response'

type UpdateVerdict = { serviceDate?: Date | null } & Pick<
  Verdict,
  | 'externalPoliceDocumentId'
  | 'serviceStatus'
  | 'serviceRequirement'
  | 'servedBy'
  | 'deliveredToDefenderNationalId'
  | 'appealDecision'
  | 'appealDate'
  | 'serviceInformationForDefendant'
  | 'isDefaultJudgement'
  | 'hash'
  | 'hashAlgorithm'
>

export type VerdictServiceCertificateDelivery = {
  delivered: boolean
  caseId: string
  defendantId: string
}

export class VerdictService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly verdictRepositoryService: VerdictRepositoryService,
    private readonly pdfService: PdfService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(forwardRef(() => DefendantService))
    private readonly defendantService: DefendantService,
    @Inject(forwardRef(() => InternalCaseService))
    private readonly internalCaseService: InternalCaseService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    verdictId: string,
    transaction?: Transaction,
  ): Promise<Verdict> {
    const verdict = await this.verdictRepositoryService.findOne({
      where: { id: verdictId },
      transaction,
    })

    if (!verdict) {
      throw new NotFoundException(`Verdict ${verdictId} does not exist`)
    }

    return verdict
  }

  async findByExternalPoliceDocumentId(
    externalPoliceDocumentId: string,
  ): Promise<Verdict> {
    const verdict = await this.verdictRepositoryService.findOne({
      where: { externalPoliceDocumentId },
    })

    if (!verdict) {
      throw new NotFoundException(
        `Verdict with police document id ${externalPoliceDocumentId} does not exist`,
      )
    }

    return verdict
  }

  async createVerdict(
    caseId: string,
    verdict: CreateVerdictDto,
    transaction: Transaction,
  ): Promise<Verdict> {
    const currentVerdict = await this.verdictRepositoryService.findOne({
      where: { defendantId: verdict.defendantId },
    })

    if (!currentVerdict) {
      return this.verdictRepositoryService.create(
        { caseId, ...verdict },
        { transaction },
      )
    }

    return currentVerdict
  }

  // upsert: if the verdict exist, we update the values otherwise we insert it
  async createVerdicts(
    caseId: string,
    verdicts: CreateVerdictDto[],
    defendants?: Defendant[],
  ): Promise<Verdict[]> {
    return this.sequelize.transaction(async (transaction) => {
      return await Promise.all(
        verdicts.map((verdict) => {
          const currentVerdict = defendants?.find(
            (defendant) => verdict.defendantId === defendant.id,
          )?.verdict
          if (currentVerdict) {
            const { defendantId, ...update } = verdict
            return this.updateVerdict(currentVerdict, update, transaction)
          } else {
            return this.createVerdict(caseId, verdict, transaction)
          }
        }),
      )
    })
  }

  async deleteVerdict(
    verdict: Verdict,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.verdictRepositoryService.delete(
      verdict.caseId,
      verdict.defendantId,
      verdict.id,
      { transaction },
    )

    return true
  }

  private async handleServiceRequirementUpdate(
    verdictId: string,
    update: UpdateVerdictDto,
    transaction: Transaction,
    rulingDate?: Date,
  ): Promise<UpdateVerdictDto> {
    if (!update.serviceRequirement) {
      return update
    }

    // rulingDate should be set, but the case completed guard can not guarantee its presence
    // ensure that ruling date is present to prevent side effects in handle service requirement update
    if (!rulingDate) {
      throw new BadRequestException(
        'Missing rulingDate for service requirement update',
      )
    }

    const currentVerdict = await this.findById(verdictId, transaction)

    // prevent updating service requirement AGAIN after a verdict has been served by police and potentially override the service date
    if (
      currentVerdict.serviceRequirement === ServiceRequirement.REQUIRED &&
      currentVerdict.serviceDate
    ) {
      throw new BadRequestException(
        `Cannot update service requirement to ${update.serviceRequirement} - verdict ${verdictId} has already be served`,
      )
    }
    // in case of repeated update, we ensure that service date is not set for specific service requirements
    return {
      ...update,
      ...(update.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
        ? { serviceDate: rulingDate }
        : { serviceDate: null }),
    }
  }

  private async updateVerdict(
    verdict: Verdict,
    update: UpdateVerdict,
    transaction?: Transaction,
  ): Promise<Verdict> {
    return this.verdictRepositoryService.update(
      verdict.caseId,
      verdict.defendantId,
      verdict.id,
      update,
      { transaction },
    )
  }

  async update(
    verdict: Verdict,
    update: UpdateVerdictDto,
    rulingDate?: Date,
  ): Promise<Verdict> {
    return this.sequelize.transaction(async (transaction) => {
      const enhancedUpdate = await this.handleServiceRequirementUpdate(
        verdict.id,
        update,
        transaction,
        rulingDate,
      )

      return this.updateVerdict(verdict, enhancedUpdate, transaction)
    })
  }

  async updateRestricted(
    verdict: Verdict,
    update: InternalUpdateVerdictDto,
  ): Promise<Verdict> {
    const updatedVerdict = await this.updateVerdict(verdict, update)
    return updatedVerdict
  }

  async updatePoliceDelivery(
    verdict: Verdict,
    update: PoliceUpdateVerdictDto,
  ): Promise<Verdict> {
    const updatedVerdict = await this.updateVerdict(verdict, update)
    return updatedVerdict
  }

  private mapToPoliceSupplementCodes(
    theCase: Case,
    defendant: Defendant,
    verdict: Verdict,
  ): { code: string; value: string }[] {
    const receiverSsn =
      defendant.nationalId &&
      normalizeAndFormatNationalId(defendant.nationalId)[0]
    const policeNumbers = theCase.policeCaseNumbers?.filter(Boolean) ?? []
    const ruling =
      theCase.courtSessions?.find(
        (courtSession) =>
          // there should only be one judgement over all court sessions
          courtSession.rulingType === CourtSessionRulingType.JUDGEMENT &&
          courtSession.ruling,
      )?.ruling ?? theCase.ruling

    return [
      { code: 'RVG_CASE_ID', value: theCase.id },
      ...(receiverSsn ? [{ code: 'RECEIVER_SSN', value: receiverSsn }] : []),
      ...(theCase.courtCaseNumber
        ? [
            {
              code: 'VERDICT_COURT_CASE_NUMBER',
              value: theCase.courtCaseNumber,
            },
          ]
        : []),
      ...(policeNumbers.length
        ? [
            {
              code: 'POLICE_CASE_NUMBERS',
              value: policeNumbers.join(','),
            },
          ]
        : []),
      ...(ruling
        ? [
            {
              code: 'RULING',
              value: ruling,
            },
          ]
        : []),
      ...(verdict && verdict.isDefaultJudgement
        ? [
            {
              code: 'REQUIRES_APPEAL_DECISION',
              value: verdict.isDefaultJudgement ? 'false' : 'true',
            },
          ]
        : []),
      ...(theCase.court?.name
        ? [
            {
              code: 'COURT_INSTITUTION',
              value: theCase.court.name,
            },
          ]
        : []),
      ...(theCase.court?.address
        ? [
            {
              code: 'COURT_ADDRESS',
              value: theCase.court.address,
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
      ...(theCase.prosecutor?.name
        ? [
            {
              code: 'PROSECUTOR_NAME',
              value: theCase.prosecutor.name,
            },
          ]
        : []),
      ...(defendant.defenderName
        ? [
            {
              code: 'DEFENDER_NAME',
              value: defendant.defenderName,
            },
          ]
        : []),
    ]
  }

  async deliverVerdictToNationalCommissionersOffice(
    theCase: Case,
    defendant: Defendant,
    verdict: Verdict,
    user: TUser,
  ): Promise<DeliverResponse> {
    // check if verdict is already delivered
    if (verdict.externalPoliceDocumentId) {
      return { delivered: true }
    }
    // get verdict file
    const verdictFile = theCase.caseFiles?.find(
      (caseFile) => caseFile.category === CaseFileCategory.RULING,
    )

    if (!verdictFile) {
      throw new NotFoundException(
        `Ruling file not found for case ${theCase.id}`,
      )
    }

    const verdictPdf = await this.fileService.getCaseFileFromS3(
      theCase,
      verdictFile,
    )

    const documentName = `Dómur í máli ${theCase.courtCaseNumber}`

    const orderByDate = new Date(verdictFile.created)
    // add two months because we don't want the order by date to be in the past when delivered to the police
    orderByDate.setMonth(orderByDate.getMonth() + 2)

    // deliver the verdict by creating the document at the police
    const createdDocument = await this.policeService.createDocument({
      caseId: theCase.id,
      defendantId: defendant.id,
      user,
      documentName,
      documentFiles: [
        {
          name: verdictFile.name,
          documentBase64: Base64.btoa(verdictPdf.toString('binary')),
        },
      ],
      documentDates: [
        { code: 'ORDER_BY_DATE', value: orderByDate },
        ...(theCase.rulingDate
          ? [{ code: 'RULING_DATE', value: theCase.rulingDate }]
          : []),
      ],
      fileTypeCode: PoliceFileTypeCode.VERDICT,
      caseSupplements: this.mapToPoliceSupplementCodes(
        theCase,
        defendant,
        verdict,
      ),
    })
    if (!createdDocument) {
      return { delivered: false }
    }

    // update existing verdict with the external document id returned from the police
    await this.updateVerdict(verdict, {
      ...createdDocument,
      hash: verdictFile.hash,
      hashAlgorithm: verdictFile.hashAlgorithm,
    })

    await this.defendantService.createDefendantEvent({
      caseId: theCase.id,
      defendantId: defendant.id,
      eventType:
        DefendantEventType.VERDICT_DELIVERED_TO_NATIONAL_COMMISSIONERS_OFFICE,
    })

    return { delivered: true }
  }

  async deliverVerdictServiceCertificatesToPolice(): Promise<
    VerdictServiceCertificateDelivery[]
  > {
    const defendantsWithCases =
      await this.internalCaseService.getIndictmentCaseDefendantsWithExpiredAppealDeadline()

    const delivered: VerdictServiceCertificateDelivery[] = []

    for (const defendantWithCase of defendantsWithCases) {
      const { defendant, theCase } = defendantWithCase

      const baseResult = { caseId: theCase.id, defendantId: defendant.id }
      const user = theCase.judge
      if (!user) {
        this.logger.warn(
          `Failed to upload verdict service certificate pdf to police of defendant ${defendant.id} and case ${theCase.id}`,
          {
            reason: 'court case user not found',
          },
        )
        delivered.push({ ...baseResult, delivered: false })
        continue
      }

      const { verdict } = defendant
      if (!verdict) {
        this.logger.warn(
          `Failed to upload verdict service certificate pdf to police of defendant ${defendant.id} and case ${theCase.id}`,
          {
            reason: 'verdict is undefined',
          },
        )
        delivered.push({ ...baseResult, delivered: false })
        continue
      }

      try {
        await this.pdfService
          .getVerdictServiceCertificatePdf(theCase, defendant, verdict)
          .then(async (pdf) => {
            const isSuccess =
              await this.internalCaseService.deliverCaseToPoliceWithFiles(
                theCase,
                {
                  ...user,
                  created: user.created.toISOString(),
                  modified: user.modified.toISOString(),
                } as TUser,
                [
                  {
                    type: PoliceDocumentType.RVBD,
                    courtDocument: Base64.btoa(pdf.toString('binary')),
                  },
                ],
              )

            if (isSuccess) {
              await this.defendantService.createDefendantEvent({
                caseId: theCase.id,
                defendantId: defendant.id,
                eventType:
                  DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE,
              })
            }
            delivered.push({ ...baseResult, delivered: isSuccess })
          })
      } catch (reason) {
        this.logger.warn(
          `Failed to upload verdict service certificate pdf to police of defendant ${defendant.id} and case ${theCase.id}`,
          { reason },
        )
        delivered.push({ ...baseResult, delivered: false })
      }
    }

    return delivered
  }

  async getAndSyncVerdict(verdict: Verdict, user?: TUser) {
    // check specifically a verdict that is delivered and service status hasn't been updated
    if (verdict.externalPoliceDocumentId && !verdict.serviceStatus) {
      const verdictInfo = await this.policeService.getVerdictDocumentStatus(
        verdict.externalPoliceDocumentId,
        user,
      )

      if (isVerdictInfoChanged(verdictInfo, verdict)) {
        return this.updateVerdict(verdict, verdictInfo)
      }
    }
    return verdict
  }

  async addMessagesForCaseVerdictDeliveryToQueue(theCase: Case, user: TUser) {
    const messages = theCase.defendants
      ?.filter(
        (defendant) =>
          defendant.verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
      )
      .map((defendant) => ({
        type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
        user,
        caseId: theCase.id,
        elementId: [defendant.id],
      }))

    if (messages && messages.length > 0) {
      this.messageService.sendMessagesToQueue(messages)
      return { queued: true }
    }
    return { queued: false }
  }
}
