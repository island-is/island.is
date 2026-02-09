import { Base64 } from 'js-base64'
import { Includeable, Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  formatDate,
  getServiceStatusText,
} from '@island.is/judicial-system/formatters'
import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseOrigin,
  CourtDocumentType,
  HashAlgorithm,
  isFailedServiceStatus,
  isIndictmentCase,
  isSubpoenaInfoChanged,
  isSuccessfulServiceStatus,
  ServiceStatus,
  SubpoenaNotificationType,
  SubpoenaType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { getCaseFileHash } from '../../formatters'
import { InternalCaseService } from '../case/internalCase.service'
import { PdfService } from '../case/pdf.service'
import { CourtDocumentFolder, CourtService } from '../court'
import { CourtDocumentService } from '../court-session'
import { DefendantService } from '../defendant/defendant.service'
import { EventService } from '../event'
import { FileService } from '../file/file.service'
import { PoliceDocumentType, PoliceService } from '../police'
import {
  Case,
  CourtSession,
  Defendant,
  Institution,
  Subpoena,
  SubpoenaRepositoryService,
  User,
} from '../repository'
import { CreateSubpoenasDto } from './dto/createSubpoenas.dto'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { DeliverResponse } from './models/deliver.response'

export const include: Includeable[] = [
  {
    model: Case,
    as: 'case',
    include: [
      {
        model: User,
        as: 'judge',
      },
      {
        model: User,
        as: 'registrar',
      },
      {
        model: Institution,
        as: 'prosecutorsOffice',
      },
      {
        model: Institution,
        as: 'court',
      },
      {
        model: CourtSession,
        as: 'courtSessions',
      },
    ],
  },
  { model: Defendant, as: 'defendant' },
]

@Injectable()
export class SubpoenaService {
  constructor(
    private readonly subpoenaRepositoryService: SubpoenaRepositoryService,
    private readonly pdfService: PdfService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    private readonly eventService: EventService,
    @Inject(forwardRef(() => DefendantService))
    private readonly defendantService: DefendantService,
    private readonly courtDocumentService: CourtDocumentService,
    private readonly courtService: CourtService,
    @Inject(forwardRef(() => InternalCaseService))
    private readonly internalCaseService: InternalCaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async createSubpoena(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
    arraignmentDate?: Date,
    location?: string,
    subpoenaType?: SubpoenaType,
  ): Promise<Subpoena> {
    return this.subpoenaRepositoryService.create(
      {
        defendantId,
        caseId,
        arraignmentDate,
        location,
        type: subpoenaType,
      },
      { transaction },
    )
  }

  async createSubpoenasForDefendants(
    createSubpoenasDto: CreateSubpoenasDto,
    transaction: Transaction,
    theCase: Case,
    user: TUser,
  ): Promise<Subpoena[]> {
    const {
      type: caseType,
      id: caseId,
      defendants,
      withCourtSessions,
      courtSessions,
    } = theCase

    // Subpoenas are only for indictment cases (also enforced by CaseTypeGuard at controller level)
    if (!isIndictmentCase(caseType)) {
      throw new BadRequestException(
        `Subpoenas can only be created for indictment cases, but case ${caseId} is of type ${caseType}`,
      )
    }

    // Filter defendants by the provided IDs
    const requestedDefendants =
      defendants?.filter((defendant) =>
        createSubpoenasDto.defendantIds.includes(defendant.id),
      ) ?? []

    if (requestedDefendants.length === 0) {
      throw new NotFoundException(
        `No defendants found for case ${caseId} with the provided IDs`,
      )
    }

    // Filter out defendants with alternative service
    const defendantsToProcess = requestedDefendants.filter(
      (defendant) => !defendant.isAlternativeService,
    )

    if (defendantsToProcess.length === 0) {
      this.logger.warn(
        `No defendants eligible for subpoenas (all have alternative service) for case ${caseId}`,
      )
      return []
    }

    // Create subpoenas for eligible defendants
    const subpoenas = await Promise.all(
      defendantsToProcess.map(async (defendant) => {
        return this.createSubpoena(
          defendant.id,
          caseId,
          transaction,
          createSubpoenasDto.arraignmentDate,
          createSubpoenasDto.location,
          defendant.subpoenaType,
        )
      }),
    )

    // Create court documents if court sessions exist
    if (withCourtSessions && courtSessions && courtSessions.length > 0) {
      for (let i = 0; i < defendantsToProcess.length; i++) {
        const defendant = defendantsToProcess[i]
        const subpoena = subpoenas[i]
        const name = `Fyrirkall ${defendant.name} ${formatDate(
          subpoena.created,
        )}`

        await this.courtDocumentService.create(
          caseId,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name,
            generatedPdfUri: `/api/case/${caseId}/subpoena/${defendant.id}/${subpoena.id}/${name}`,
          },
          transaction,
        )
      }
    }

    // Queue messages for delivering subpoenas to police, court, and national commissioners office
    await this.queueSubpoenaDeliveryMessages(
      theCase,
      defendantsToProcess,
      subpoenas,
      user,
    )

    return subpoenas
  }

  private async queueSubpoenaDeliveryMessages(
    theCase: Case,
    defendants: Defendant[],
    subpoenas: Subpoena[],
    user: TUser,
  ): Promise<void> {
    const messages = []

    for (let i = 0; i < defendants.length; i++) {
      const defendant = defendants[i]
      const subpoena = subpoenas[i]

      // For LOKE origin cases, also send to police
      if (theCase.origin === CaseOrigin.LOKE) {
        messages.push({
          type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
          user,
          caseId: theCase.id,
          elementId: [defendant.id, subpoena.id],
        })
      }

      // Always send to national commissioners office and court
      messages.push(
        {
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendant.id, subpoena.id],
        },
        {
          type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendant.id, subpoena.id],
        },
      )
    }

    if (messages.length > 0) {
      addMessagesToQueue(...messages)
    }
  }

  setHash(
    caseId: string,
    defendantId: string,
    subpoenaId: string,
    hash: string,
    hashAlgorithm: HashAlgorithm,
    transaction: Transaction,
  ): Promise<Subpoena> {
    return this.subpoenaRepositoryService.update(
      caseId,
      defendantId,
      subpoenaId,
      { hash, hashAlgorithm },
      { transaction },
    )
  }

  private addMessagesForSubpoenaUpdateToQueue(
    subpoena: Subpoena,
    serviceStatus?: ServiceStatus,
  ): void {
    if (serviceStatus && serviceStatus !== subpoena.serviceStatus) {
      if (isSuccessfulServiceStatus(serviceStatus)) {
        addMessagesToQueue({
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_SUCCESSFUL,
          },
        })
      } else if (isFailedServiceStatus(serviceStatus)) {
        addMessagesToQueue({
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_FAILED,
          },
        })
      }
    }
  }

  async update(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    update: UpdateSubpoenaDto,
    transaction: Transaction,
  ): Promise<Subpoena> {
    const {
      defenderChoice,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      defenderName,
      serviceStatus,
      requestedDefenderChoice,
      requestedDefenderNationalId,
      requestedDefenderName,
    } = update

    await this.subpoenaRepositoryService.update(
      theCase.id,
      defendant.id,
      subpoena.id,
      update,
      { transaction, throwOnZeroRows: false },
    )

    if (
      defenderChoice ||
      defenderNationalId ||
      defenderName ||
      defenderEmail ||
      defenderPhoneNumber ||
      requestedDefenderChoice ||
      requestedDefenderNationalId ||
      requestedDefenderName
    ) {
      // Færa message handling í defendant service
      await this.defendantService.updateRestricted(
        theCase,
        defendant,
        {
          defenderChoice,
          defenderNationalId,
          defenderName,
          defenderEmail,
          defenderPhoneNumber,
          requestedDefenderChoice,
          requestedDefenderNationalId,
          requestedDefenderName,
        },
        transaction,
      )
    }

    // Are we observing a successful service for the first time?
    // We assume that a successful service status will never be
    // replaced by another successful service status
    const wasSubpoenaSuccessfullyServed =
      serviceStatus &&
      serviceStatus !== subpoena.serviceStatus &&
      [
        ServiceStatus.DEFENDER,
        ServiceStatus.ELECTRONICALLY,
        ServiceStatus.IN_PERSON,
      ].includes(serviceStatus)

    // File the service certificate as a court document
    if (
      wasSubpoenaSuccessfullyServed &&
      theCase.withCourtSessions &&
      theCase.courtSessions &&
      theCase.courtSessions.length > 0
    ) {
      const name = `Birtingarvottorð ${defendant.name}`

      await this.courtDocumentService.create(
        theCase.id,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name,
          generatedPdfUri: `/api/case/${theCase.id}/subpoenaServiceCertificate/${defendant.id}/${subpoena.id}/${name}`,
        },
        transaction,
      )
    }

    // No need to wait for this to finish
    await this.addMessagesForSubpoenaUpdateToQueue(subpoena, serviceStatus)

    if (
      update.serviceStatus &&
      update.serviceStatus !== subpoena.serviceStatus
    ) {
      this.eventService.postEvent('SUBPOENA_SERVICE_STATUS', theCase, false, {
        Staða: getServiceStatusText(update.serviceStatus),
      })
    }

    return this.findById(subpoena.id, transaction)
  }

  async findById(
    subpoenaId: string,
    transaction: Transaction,
  ): Promise<Subpoena> {
    const subpoena = await this.subpoenaRepositoryService.findOne({
      include,
      where: { id: subpoenaId },
      transaction,
    })

    if (!subpoena) {
      throw new NotFoundException(`Subpoena ${subpoenaId} does not exist`)
    }

    return subpoena
  }

  async findByPoliceSubpoenaId(policeSubpoenaId?: string): Promise<Subpoena> {
    const subpoena = await this.subpoenaRepositoryService.findOne({
      include,
      where: { policeSubpoenaId },
    })

    if (!subpoena) {
      throw new NotFoundException(
        `Subpoena with police subpoena id ${policeSubpoenaId} does not exist`,
      )
    }

    return subpoena
  }

  async findByCaseId(caseId: string): Promise<Subpoena[]> {
    return this.subpoenaRepositoryService.findAll({
      include,
      where: { caseId },
    })
  }

  async deliverSubpoenaToNationalCommissionersOffice({
    theCase,
    defendant,
    subpoena,
    user,
    transaction,
  }: {
    theCase: Case
    defendant: Defendant
    subpoena: Subpoena
    user: TUser
    transaction: Transaction
  }): Promise<DeliverResponse> {
    try {
      const civilClaimPdfs: string[] = []
      const civilClaimFiles =
        theCase.caseFiles?.filter(
          (caseFile) => caseFile.category === CaseFileCategory.CIVIL_CLAIM,
        ) ?? []

      for (const civilClaimFile of civilClaimFiles) {
        const civilClaimPdf = await this.fileService.getCaseFileFromS3(
          theCase,
          civilClaimFile,
        )
        const civilClaimantHash = getCaseFileHash(civilClaimPdf)
        await this.fileService.updateCaseFile(theCase.id, civilClaimFile.id, {
          hash: civilClaimantHash.hash,
          hashAlgorithm: civilClaimantHash.hashAlgorithm,
        })

        civilClaimPdfs.push(Base64.btoa(civilClaimPdf.toString('binary')))
      }

      const indictmentPdf = await this.pdfService.getIndictmentPdf(
        theCase,
        transaction,
      )
      const subpoenaPdf = await this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
        transaction,
        subpoena,
      )

      const createdSubpoena = await this.policeService.createSubpoena({
        theCase,
        defendant,
        subpoenaId: subpoena.id,
        subpoena: Base64.btoa(subpoenaPdf.toString('binary')),
        indictment: Base64.btoa(indictmentPdf.toString('binary')),
        user,
        civilClaims: civilClaimPdfs,
      })

      if (!createdSubpoena) {
        this.logger.error('Failed to create subpoena file for police')

        return { delivered: false }
      }

      await this.subpoenaRepositoryService.update(
        theCase.id,
        defendant.id,
        subpoena.id,
        { policeSubpoenaId: createdSubpoena.policeSubpoenaId },
        { transaction, throwOnZeroRows: false },
      )

      this.logger.info(
        `Subpoena with police subpoena id ${createdSubpoena.policeSubpoenaId} delivered to the police centralized file service`,
      )

      return { delivered: true }
    } catch (error) {
      this.logger.error(
        'Error delivering subpoena to the police centralized file service',
        error,
      )

      return { delivered: false }
    }
  }

  async deliverSubpoenaFileToPolice(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    user: TUser,
    transaction: Transaction,
  ): Promise<DeliverResponse> {
    try {
      const subpoenaPdf = await this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
        transaction,
        subpoena,
      )

      const delivered =
        await this.internalCaseService.deliverCaseToPoliceWithFiles(
          theCase,
          user,
          [
            {
              type: PoliceDocumentType.RVFK,
              courtDocument: Base64.btoa(subpoenaPdf.toString('binary')),
            },
          ],
        )

      return { delivered }
    } catch (error) {
      this.logger.error('Error delivering subpoena to police', error)

      return { delivered: false }
    }
  }

  async deliverSubpoenaToCourt(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    user: TUser,
    transaction: Transaction,
  ): Promise<DeliverResponse> {
    return this.pdfService
      .getSubpoenaPdf(theCase, defendant, transaction, subpoena)
      .then(async (pdf) => {
        const fileName = `Fyrirkall - ${defendant.name}`

        return this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId,
          theCase.courtCaseNumber,
          CourtDocumentFolder.SUBPOENA_DOCUMENTS,
          fileName,
          `${fileName}.pdf`,
          'application/pdf',
          pdf,
        )
      })
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.warn(
          `Failed to upload subpoena ${subpoena.id} pdf to court for defendant ${defendant.id} of case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverServiceCertificateToCourt(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.pdfService
      .getSubpoenaServiceCertificatePdf(theCase, defendant, subpoena)
      .then(async (pdf) => {
        const fileName = `Birtingarvottorð - ${defendant.name}`

        return this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId,
          theCase.courtCaseNumber,
          CourtDocumentFolder.SUBPOENA_DOCUMENTS,
          fileName,
          `${fileName}.pdf`,
          'application/pdf',
          pdf,
        )
      })
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.warn(
          `Failed to upload service certificate pdf to court for subpoena ${subpoena.id} of defendant ${defendant.id} and case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverSubpoenaRevocationToNationalCommissionersOffice(
    theCase: Case,
    subpoena: Subpoena,
    user: TUser,
  ): Promise<DeliverResponse> {
    if (!subpoena.policeSubpoenaId) {
      this.logger.warn(
        `Attempted to revoke a subpoena with id ${subpoena.id} that had not been delivered to the national commissioners office`,
      )
      return { delivered: true }
    }

    const subpoenaRevoked = await this.policeService.revokeSubpoena(
      theCase,
      subpoena.policeSubpoenaId,
      user,
    )

    if (subpoenaRevoked) {
      this.logger.info(
        `Subpoena ${subpoena.policeSubpoenaId} successfully revoked from police`,
      )
      return { delivered: true }
    } else {
      return { delivered: false }
    }
  }

  async getSubpoena(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    transaction: Transaction,
    user?: TUser,
  ): Promise<Subpoena> {
    if (!subpoena.policeSubpoenaId) {
      // The subpoena has not been delivered to the police
      return subpoena
    }

    if (isSuccessfulServiceStatus(subpoena.serviceStatus)) {
      // The subpoena has already been served to the defendant
      return subpoena
    }

    // We don't know if the subpoena has been served to the defendant
    // so we need to check the police service
    const subpoenaInfo = await this.policeService.getSubpoenaStatus(
      subpoena.policeSubpoenaId,
      user,
    )

    if (!isSubpoenaInfoChanged(subpoenaInfo, subpoena)) {
      // The subpoena has not changed
      return subpoena
    }

    return this.update(theCase, defendant, subpoena, subpoenaInfo, transaction)
  }
}
