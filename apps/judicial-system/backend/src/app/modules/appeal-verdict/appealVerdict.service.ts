import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  DocumentDeliveryReceiverType,
  DocumentDeliverySupplementCode,
  isVerdictInfoChanged,
  PoliceFileTypeCode,
  ServiceRequirement,
  type User,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { queueMessagesAfterCommit } from '../../middleware'
import { FileService } from '../file'
import { isFileTooLargeForPolice, PoliceService } from '../police'
import {
  AppealVerdict,
  AppealVerdictRepositoryService,
  Case,
  CaseRepositoryService,
} from '../repository'
import { PoliceUpdateAppealVerdictDto } from './dto/policeUpdateAppealVerdict.dto'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class AppealVerdictService {
  constructor(
    private readonly appealVerdictRepositoryService: AppealVerdictRepositoryService,
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly fileService: FileService,
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  findById(appealVerdictId: string, transaction?: Transaction) {
    return this.appealVerdictRepositoryService.findById(appealVerdictId, {
      transaction,
    })
  }

  async findByExternalPoliceDocumentId(externalPoliceDocumentId: string) {
    return this.appealVerdictRepositoryService.findByExternalPoliceDocumentId(
      externalPoliceDocumentId,
    )
  }

  async sendToService(
    theCase: Case,
    defendantIds: string[],
    user: User,
    transaction: Transaction,
  ): Promise<AppealVerdict[]> {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(
        `Case ${theCase.id} has no verdict appeal case`,
      )
    }

    const rulingFile = theCase.caseFiles?.find(
      (caseFile) =>
        caseFile.category === CaseFileCategory.VERDICT_APPEAL_RULING,
    )

    if (!rulingFile) {
      throw new NotFoundException(
        `COA ruling file not found for case ${theCase.id}`,
      )
    }

    const sentToServiceDate = new Date()
    const created: AppealVerdict[] = []

    for (const defendantId of defendantIds) {
      const defendant = theCase.defendants?.find(
        (row) => row.id === defendantId,
      )

      if (!defendant) {
        throw new BadRequestException(
          `Defendant ${defendantId} was not found on case ${theCase.id}`,
        )
      }

      if (defendant.noNationalId || !defendant.nationalId) {
        throw new BadRequestException(
          `National id is required for defendant ${defendantId} when sending a COA verdict to service`,
        )
      }

      const existing =
        await this.appealVerdictRepositoryService.findByDefendantId(
          defendantId,
          { transaction },
        )

      if (existing?.externalPoliceDocumentId || existing?.sentToServiceDate) {
        throw new BadRequestException(
          `Appeal verdict for defendant ${defendantId} has already been sent to service`,
        )
      }

      const appealVerdict =
        existing ??
        (await this.appealVerdictRepositoryService.create(
          {
            caseId: theCase.id,
            appealCaseId: appealCase.id,
            defendantId,
            serviceRequirement: ServiceRequirement.REQUIRED,
            sentToServiceDate,
          },
          { transaction },
        ))

      const ready =
        existing && !existing.sentToServiceDate
          ? await this.appealVerdictRepositoryService.update(
              existing.id,
              {
                serviceRequirement: ServiceRequirement.REQUIRED,
                sentToServiceDate,
              },
              { transaction },
            )
          : appealVerdict

      created.push(ready)

      queueMessagesAfterCommit({
        type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_APPEAL_VERDICT,
        user,
        caseId: theCase.id,
        elementId: ready.id,
      })
    }

    return created
  }

  async deliverAppealVerdictToNationalCommissionersOffice({
    theCase,
    appealVerdict,
    user,
    transaction,
  }: {
    theCase: Case
    appealVerdict: AppealVerdict
    user: User
    transaction: Transaction
  }): Promise<DeliverResponse> {
    const locked = await this.appealVerdictRepositoryService.findByIdForUpdate(
      appealVerdict.id,
      { transaction },
    )

    if (!locked) {
      throw new NotFoundException(
        `Appeal verdict ${appealVerdict.id} was not found`,
      )
    }

    if (locked.externalPoliceDocumentId) {
      return { delivered: true }
    }

    const defendant = theCase.defendants?.find(
      (row) => row.id === locked.defendantId,
    )

    if (!defendant) {
      throw new NotFoundException(
        `Defendant ${locked.defendantId} was not found on case ${theCase.id}`,
      )
    }

    if (defendant.noNationalId || !defendant.nationalId) {
      throw new BadRequestException(
        `National id is required for defendant ${defendant.id} when delivering a COA verdict to national commissioners office`,
      )
    }

    try {
      const rulingFile = theCase.caseFiles?.find(
        (caseFile) =>
          caseFile.category === CaseFileCategory.VERDICT_APPEAL_RULING,
      )

      if (!rulingFile) {
        throw new NotFoundException(
          `COA ruling file not found for case ${theCase.id}`,
        )
      }

      const rulingPdf = await this.fileService.getCaseFileFromS3(
        theCase,
        rulingFile,
      )

      const appealCaseNumber =
        theCase.verdictAppealCase?.appealCaseNumber ?? theCase.courtCaseNumber
      const documentName = `Dómur Landsréttar í máli ${appealCaseNumber}`

      const orderByDate = new Date(
        locked.sentToServiceDate ?? rulingFile.created,
      )
      orderByDate.setMonth(orderByDate.getMonth() + 2)

      const originalAncestorCaseId =
        await this.caseRepositoryService.findOriginalAncestorId(theCase, {
          transaction,
        })

      const policeCaseNumbers = theCase.policeCaseNumbers?.filter(Boolean) ?? []

      const createdDocument = await this.policeService.createDocument({
        caseId: theCase.id,
        defendantId: defendant.id,
        user,
        documentName,
        documentFiles: [
          {
            name: rulingFile.name,
            documentBase64: Base64.btoa(rulingPdf.toString('binary')),
          },
        ],
        documentDates: [
          { code: 'ORDER_BY_DATE', value: orderByDate },
          ...(theCase.verdictAppealCase?.appealRulingDate
            ? [
                {
                  code: 'RULING_DATE',
                  value: theCase.verdictAppealCase.appealRulingDate,
                },
              ]
            : []),
        ],
        fileTypeCode: PoliceFileTypeCode.APPEAL_VERDICT,
        caseSupplements: [
          { code: 'RVG_CASE_ID', value: originalAncestorCaseId },
          { code: 'RVG_DOCUMENT_ID', value: locked.id },
          { code: 'RECEIVER_SSN', value: defendant.nationalId },
          {
            code: DocumentDeliverySupplementCode.RECEIVER_TYPE,
            value: DocumentDeliveryReceiverType.DEFENDANT,
          },
          ...(appealCaseNumber
            ? [
                {
                  code: 'VERDICT_COURT_CASE_NUMBER',
                  value: appealCaseNumber,
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

      await this.appealVerdictRepositoryService.update(
        locked.id,
        {
          ...createdDocument,
          hash: rulingFile.hash,
          hashAlgorithm: rulingFile.hashAlgorithm,
        },
        { transaction },
      )

      return { delivered: true }
    } catch (error) {
      if (isFileTooLargeForPolice(error)) {
        return { delivered: true }
      }

      this.logger.error(
        'Error delivering appeal verdict to the national commissioners office',
        error,
      )

      throw error
    }
  }

  async updatePoliceDelivery(
    appealVerdict: AppealVerdict,
    update: PoliceUpdateAppealVerdictDto,
    transaction: Transaction,
  ): Promise<AppealVerdict> {
    // Same as district verdict police update: persist appealDecision from the
    // police payload without inventing an appealDate here.
    return this.appealVerdictRepositoryService.update(
      appealVerdict.id,
      {
        serviceStatus: update.serviceStatus,
        serviceDate: update.serviceDate,
        servedBy: update.servedBy,
        comment: update.comment,
        deliveredToDefenderNationalId: update.deliveredToDefenderNationalId,
        appealDecision: update.appealDecision,
      },
      { transaction },
    )
  }

  async syncServiceStatusesForCase(
    theCase: Case,
    user: User,
    getTransaction: () => Promise<Transaction>,
  ): Promise<AppealVerdict[]> {
    const rows = await this.appealVerdictRepositoryService.findByCaseId(
      theCase.id,
    )

    const pulls: Array<{
      appealVerdict: AppealVerdict
      update: {
        serviceStatus?: VerdictServiceStatus
        serviceDate?: Date
        servedBy?: string
        comment?: string
      }
    }> = []

    for (const appealVerdict of rows) {
      if (
        !appealVerdict.externalPoliceDocumentId ||
        appealVerdict.serviceStatus
      ) {
        continue
      }

      let policeInfo
      try {
        policeInfo = await this.policeService.getVerdictDocumentStatus(
          appealVerdict.externalPoliceDocumentId,
          user,
        )
      } catch (reason) {
        this.logger.warn(
          `Failed to sync status of appeal verdict ${appealVerdict.id}`,
          { reason },
        )
        continue
      }

      if (!isVerdictInfoChanged(policeInfo, appealVerdict)) {
        continue
      }

      pulls.push({
        appealVerdict,
        update: {
          serviceStatus: policeInfo.serviceStatus,
          serviceDate: policeInfo.serviceDate,
          servedBy: policeInfo.servedBy,
          comment: policeInfo.comment,
        },
      })
    }

    if (pulls.length === 0) {
      return []
    }

    const transaction = await getTransaction()
    const updated: AppealVerdict[] = []

    for (const pull of pulls) {
      const recorded =
        await this.appealVerdictRepositoryService.recordServiceStatusIfUnset(
          pull.appealVerdict.id,
          pull.update,
          { transaction },
        )

      if (recorded) {
        updated.push(recorded)
      }
    }

    return updated
  }
}
