import { Base64 } from 'js-base64'
import { Includeable, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { getServiceStatusText } from '@island.is/judicial-system/formatters'
import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CourtDocumentType,
  HashAlgorithm,
  isFailedServiceStatus,
  isSubpoenaInfoChanged,
  isSuccessfulServiceStatus,
  ServiceStatus,
  SubpoenaNotificationType,
  SubpoenaType,
  type User as TUser,
} from '@island.is/judicial-system/types'

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
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly subpoenaRepositoryService: SubpoenaRepositoryService,
    private readonly pdfService: PdfService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    private readonly messageService: MessageService,
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

  async createSubpoena(
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

  async setHash(
    caseId: string,
    defendantId: string,
    subpoenaId: string,
    hash: string,
    hashAlgorithm: HashAlgorithm,
  ): Promise<void> {
    await this.subpoenaRepositoryService.update(
      caseId,
      defendantId,
      subpoenaId,
      { hash, hashAlgorithm },
    )
  }

  private async addMessagesForSubpoenaUpdateToQueue(
    subpoena: Subpoena,
    serviceStatus?: ServiceStatus,
  ): Promise<void> {
    let message: Message | undefined = undefined

    if (serviceStatus && serviceStatus !== subpoena.serviceStatus) {
      if (isSuccessfulServiceStatus(serviceStatus)) {
        message = {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_SUCCESSFUL,
          },
        }
      } else if (isFailedServiceStatus(serviceStatus)) {
        message = {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_FAILED,
          },
        }
      }
    }

    if (!message) {
      return
    }

    return this.messageService.sendMessagesToQueue([message])
  }

  async update(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    update: UpdateSubpoenaDto,
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

    await this.sequelize.transaction(async (transaction) => {
      await this.subpoenaRepositoryService.update(
        theCase.id,
        defendant.id,
        subpoena.id,
        update,
        {
          transaction,
          throwOnZeroRows: false,
        },
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

        return this.courtDocumentService.create(
          theCase.id,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name,
            generatedPdfUri: `/api/case/${theCase.id}/subpoenaServiceCertificate/${defendant.id}/${subpoena.id}/${name}`,
          },
          transaction,
        )
      }
    })

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

    return this.findById(subpoena.id)
  }

  async findById(subpoenaId: string): Promise<Subpoena> {
    const subpoena = await this.subpoenaRepositoryService.findOne({
      include,
      where: { id: subpoenaId },
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

  async deliverSubpoenaToNationalCommissionersOffice(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    user: TUser,
  ): Promise<DeliverResponse> {
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

        civilClaimPdfs.push(Base64.btoa(civilClaimPdf.toString('binary')))
      }

      const indictmentPdf = await this.pdfService.getIndictmentPdf(theCase)
      const subpoenaPdf = await this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
        subpoena,
      )

      const createdSubpoena = await this.policeService.createSubpoena(
        theCase,
        defendant,
        Base64.btoa(subpoenaPdf.toString('binary')),
        Base64.btoa(indictmentPdf.toString('binary')),
        user,
        civilClaimPdfs,
      )

      if (!createdSubpoena) {
        this.logger.error('Failed to create subpoena file for police')

        return { delivered: false }
      }

      await this.subpoenaRepositoryService.update(
        theCase.id,
        defendant.id,
        subpoena.id,
        { policeSubpoenaId: createdSubpoena.policeSubpoenaId },
        { throwOnZeroRows: false },
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
  ): Promise<DeliverResponse> {
    try {
      const subpoenaPdf = await this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
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
  ): Promise<DeliverResponse> {
    return this.pdfService
      .getSubpoenaPdf(theCase, defendant, subpoena)
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

    return this.update(theCase, defendant, subpoena, subpoenaInfo)
  }
}
