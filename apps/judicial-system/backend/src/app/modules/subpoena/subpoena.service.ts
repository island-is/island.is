import { Base64 } from 'js-base64'
import {
  col,
  fn,
  Includeable,
  literal,
  Op,
  Sequelize,
  WhereOptions,
} from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  HashAlgorithm,
  isFailedServiceStatus,
  isSuccessfulServiceStatus,
  ServiceStatus,
  SubpoenaNotificationType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { InternalCaseService } from '../case/internalCase.service'
import { Case } from '../case/models/case.model'
import { PdfService } from '../case/pdf.service'
import { CourtDocumentFolder, CourtService } from '../court'
import { DefendantService } from '../defendant/defendant.service'
import { Defendant } from '../defendant/models/defendant.model'
import { EventService } from '../event'
import { FileService } from '../file/file.service'
import { Institution } from '../institution'
import { PoliceDocumentType, PoliceService, SubpoenaInfo } from '../police'
import { User } from '../user'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'
import {
  ServiceStatusStatistics,
  SubpoenaStatistics,
} from './models/subpoenaStatistics.response'

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
    ],
  },
  { model: Defendant, as: 'defendant' },
]

const subpoenaInfoKeys: Array<keyof SubpoenaInfo> = [
  'serviceStatus',
  'comment',
  'servedBy',
  'defenderNationalId',
  'serviceDate',
]

const isNewValueSetAndDifferent = (
  newValue: unknown,
  oldValue: unknown,
): boolean => Boolean(newValue) && newValue !== oldValue

export const isSubpoenaInfoChanged = (
  newSubpoenaInfo: SubpoenaInfo,
  oldSubpoenaInfo: SubpoenaInfo,
) =>
  subpoenaInfoKeys.some((key) =>
    isNewValueSetAndDifferent(newSubpoenaInfo[key], oldSubpoenaInfo[key]),
  )

@Injectable()
export class SubpoenaService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    private readonly pdfService: PdfService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    private readonly eventService: EventService,
    private readonly defendantService: DefendantService,
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
  ): Promise<Subpoena> {
    return this.subpoenaModel.create(
      {
        defendantId,
        caseId,
        arraignmentDate,
        location,
      },
      { transaction },
    )
  }

  async setHash(
    id: string,
    hash: string,
    hashAlgorithm: HashAlgorithm,
  ): Promise<void> {
    const [numberOfAffectedRows] = await this.subpoenaModel.update(
      { hash, hashAlgorithm },
      { where: { id } },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena hash for subpoena ${id}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(`Could not update subpoena ${id}`)
    }
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
      const [numberOfAffectedRows] = await this.subpoenaModel.update(update, {
        where: { id: subpoena.id },
        returning: true,
        transaction,
      })

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows ${numberOfAffectedRows} affected when updating subpoena`,
        )
      }

      if (
        subpoena.case &&
        subpoena.defendant &&
        (defenderChoice ||
          defenderNationalId ||
          defenderName ||
          defenderEmail ||
          defenderPhoneNumber ||
          requestedDefenderChoice ||
          requestedDefenderNationalId ||
          requestedDefenderName)
      ) {
        // If there is a change in the defender choice after the judge has confirmed the choice,
        // we need to set the isDefenderChoiceConfirmed to false
        const resetDefenderChoiceConfirmed =
          subpoena.defendant?.isDefenderChoiceConfirmed &&
          ((defenderChoice &&
            subpoena.defendant?.defenderChoice !== defenderChoice) ||
            (defenderNationalId &&
              subpoena.defendant?.defenderNationalId !== defenderNationalId))

        // Færa message handling í defendant service
        await this.defendantService.updateRestricted(
          subpoena.case,
          subpoena.defendant,
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
          resetDefenderChoiceConfirmed ? false : undefined,
          transaction,
        )
      }
    })

    // No need to wait for this to finish
    await this.addMessagesForSubpoenaUpdateToQueue(subpoena, serviceStatus)

    if (
      update.serviceStatus &&
      update.serviceStatus !== subpoena.serviceStatus &&
      subpoena.case
    ) {
      this.eventService.postEvent(
        'SUBPOENA_SERVICE_STATUS',
        subpoena.case,
        false,
        { Staða: Subpoena.serviceStatusText(update.serviceStatus) },
      )
    }

    return this.findById(subpoena.id)
  }

  async findById(subpoenaId: string): Promise<Subpoena> {
    const subpoena = await this.subpoenaModel.findOne({
      include,
      where: { id: subpoenaId },
    })

    if (!subpoena) {
      throw new NotFoundException(`Subpoena ${subpoenaId} does not exist`)
    }

    return subpoena
  }

  async findByPoliceSubpoenaId(policeSubpoenaId?: string): Promise<Subpoena> {
    const subpoena = await this.subpoenaModel.findOne({
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
    return this.subpoenaModel.findAll({
      include,
      where: { caseId },
    })
  }

  async deliverSubpoenaToPolice(
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

      const [numberOfAffectedRows] = await this.subpoenaModel.update(
        { policeSubpoenaId: createdSubpoena.policeSubpoenaId },
        { where: { id: subpoena.id } },
      )

      if (numberOfAffectedRows !== 1) {
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena for subpoena ${subpoena.id}`,
        )
      }

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
      .getServiceCertificatePdf(theCase, defendant, subpoena)
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

  async deliverSubpoenaRevocationToPolice(
    theCase: Case,
    subpoena: Subpoena,
    user: TUser,
  ): Promise<DeliverResponse> {
    if (!subpoena.policeSubpoenaId) {
      this.logger.warn(
        `Attempted to revoke a subpoena with id ${subpoena.id} that had not been delivered to the police`,
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

  async getSubpoena(subpoena: Subpoena, user?: TUser): Promise<Subpoena> {
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

    return this.update(subpoena, subpoenaInfo)
  }

  async getStatistics(
    from?: Date,
    to?: Date,
    institutionId?: string,
  ): Promise<SubpoenaStatistics> {
    const where: WhereOptions = {
      policeSubpoenaId: {
        [Op.ne]: null,
      },
    }

    if (from || to) {
      where.created = {}
      if (from) {
        where.created[Op.gte] = from
      }
      if (to) {
        where.created[Op.lte] = to
      }
    }

    const include: Includeable[] = []

    if (institutionId) {
      include.push({
        model: Case,
        required: true,
        attributes: [],
        where: {
          [Op.or]: [
            { courtId: institutionId },
            { prosecutorsOfficeId: institutionId },
          ],
        },
      })
    }

    const count = await this.subpoenaModel.count({
      where,
      include,
    })

    const grouped = (await this.subpoenaModel.findAll({
      where,
      include,
      attributes: [
        'serviceStatus',
        [fn('COUNT', col('Subpoena.id')), 'count'],
        [
          literal(
            'AVG(EXTRACT(EPOCH FROM "Subpoena"."service_date" - "Subpoena"."created") * 1000)',
          ),
          'averageServiceTimeMs',
        ],
      ],
      group: ['serviceStatus'],
      raw: true,
    })) as unknown as {
      serviceStatus: ServiceStatus | null
      count: string
      averageServiceTimeMs: string | null
    }[]

    const serviceStatusStatistics: ServiceStatusStatistics[] = grouped.map(
      (row) => ({
        serviceStatus: row.serviceStatus,
        count: Number(row.count),
        averageServiceTimeMs: Math.round(Number(row.averageServiceTimeMs) || 0),
        averageServiceTimeDays:
          Math.round(Number(row.averageServiceTimeMs) / 1000 / 60 / 60 / 24) ||
          0,
      }),
    )

    const stats: SubpoenaStatistics = {
      count,
      serviceStatusStatistics,
    }

    return stats
  }
}
