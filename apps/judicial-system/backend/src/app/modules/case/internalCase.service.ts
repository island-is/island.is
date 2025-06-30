import CryptoJS from 'crypto-js'
import format from 'date-fns/format'
import { Base64 } from 'js-base64'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  formatCaseType,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  EventType,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  isRestrictionCase,
  NotificationType,
  restrictionCases,
  type User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import {
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  getCustodyNoticePdfAsString,
  getRequestPdfAsBuffer,
  getRequestPdfAsString,
  stripHtmlTags,
} from '../../formatters'
import { courtUpload, notifications } from '../../messages'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { courtSubtypes } from '../court/court.service'
import { Defendant, DefendantService } from '../defendant'
import { EventService } from '../event'
import { CaseFile, FileService } from '../file'
import { IndictmentCount, IndictmentCountService } from '../indictment-count'
import { Offense } from '../indictment-count/models/offense.model'
import { Institution } from '../institution'
import { PoliceDocument, PoliceDocumentType, PoliceService } from '../police'
import { Subpoena, SubpoenaService } from '../subpoena'
import { User, UserService } from '../user'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { archiveFilter } from './filters/case.archiveFilter'
import { ArchiveResponse } from './models/archive.response'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseString } from './models/caseString.model'
import { DateLog } from './models/dateLog.model'
import { DeliverResponse } from './models/deliver.response'
import { caseModuleConfig } from './case.config'
import { PdfService } from './pdf.service'

const caseEncryptionProperties: (keyof Case)[] = [
  'description',
  'demands',
  'requestedOtherRestrictions',
  'caseFacts',
  'legalArguments',
  'prosecutorOnlySessionRequest',
  'comments',
  'caseFilesComments',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'sessionBookings',
  'courtCaseFacts',
  'introduction',
  'courtLegalArguments',
  'ruling',
  'conclusion',
  'endOfSessionBookings',
  'accusedAppealAnnouncement',
  'prosecutorAppealAnnouncement',
  'caseModifiedExplanation',
  'caseResentExplanation',
  'crimeScenes',
  'indictmentIntroduction',
  'appealConclusion',
  'appealRulingModifiedHistory',
  'indictmentDeniedExplanation',
  'indictmentReturnedExplanation',
]

const defendantEncryptionProperties: (keyof Defendant)[] = [
  'nationalId',
  'name',
  'address',
]

const caseFileEncryptionProperties: (keyof CaseFile)[] = [
  'name',
  'key',
  'userGeneratedFilename',
]

const indictmentCountEncryptionProperties: (keyof IndictmentCount)[] = [
  'vehicleRegistrationNumber',
  'incidentDescription',
  'legalArguments',
]

const caseStringEncryptionProperties: (keyof CaseString)[] = ['value']

const collectEncryptionProperties = (
  properties: string[],
  unknownSource: unknown,
): [{ [key: string]: string | null }, { [key: string]: unknown }] => {
  const source = unknownSource as { [key: string]: unknown }
  return properties.reduce<
    [{ [key: string]: string | null }, { [key: string]: unknown }]
  >(
    (data, property) => [
      {
        ...data[0],
        [property]: typeof source[property] === 'string' ? '' : null,
      },
      { ...data[1], [property]: source[property] },
    ],
    [{}, {}],
  )
}

@Injectable()
export class InternalCaseService {
  private throttle = Promise.resolve(false)

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(CaseString)
    private readonly caseStringModel: typeof CaseString,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    @Inject(forwardRef(() => IntlService))
    private readonly intlService: IntlService,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    @Inject(forwardRef(() => AwsS3Service))
    private readonly awsS3Service: AwsS3Service,
    @Inject(forwardRef(() => CourtService))
    private readonly courtService: CourtService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => IndictmentCountService))
    private readonly indictmentCountService: IndictmentCountService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => DefendantService))
    private readonly defendantService: DefendantService,
    @Inject(forwardRef(() => SubpoenaService))
    private readonly subpoenaService: SubpoenaService,
    @Inject(forwardRef(() => PdfService))
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async uploadSignedRulingPdfToCourt(
    theCase: Case,
    buffer: Buffer,
    user: TUser,
  ): Promise<boolean> {
    const fileName = this.formatMessage(courtUpload.ruling, {
      courtCaseNumber: theCase.courtCaseNumber,
      date: format(nowFactory(), 'yyyy-MM-dd HH:mm'),
    })

    try {
      await this.courtService.createDocument(
        user,
        theCase.id,
        theCase.courtId,
        theCase.courtCaseNumber,
        CourtDocumentFolder.COURT_DOCUMENTS,
        fileName,
        `${fileName}.pdf`,
        'application/pdf',
        buffer,
      )

      return true
    } catch (error) {
      this.logger.warn(
        `Failed to upload signed ruling pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async uploadCourtRecordPdfToCourt(
    theCase: Case,
    user: TUser,
    buffer?: Buffer,
  ): Promise<boolean> {
    try {
      const pdf =
        buffer || (await getCourtRecordPdfAsBuffer(theCase, this.formatMessage))

      const fileName = this.formatMessage(courtUpload.courtRecord, {
        courtCaseNumber: theCase.courtCaseNumber,
        date: format(nowFactory(), 'yyyy-MM-dd HH:mm'),
      })

      await this.courtService.createCourtRecord(
        user,
        theCase.id,
        theCase.courtId,
        theCase.courtCaseNumber,
        fileName,
        `${fileName}.pdf`,
        'application/pdf',
        pdf,
      )

      return true
    } catch (error) {
      // Log and ignore this error. The court record can be uploaded manually.
      this.logger.warn(
        `Failed to upload court record pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async uploadRequestPdfToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<boolean> {
    return getRequestPdfAsBuffer(theCase, this.formatMessage)
      .then((pdf) => {
        const fileName = this.formatMessage(courtUpload.request, {
          caseType: formatCaseType(theCase.type),
          date: format(nowFactory(), 'yyyy-MM-dd HH:mm'),
        })

        return this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId,
          theCase.courtCaseNumber,
          CourtDocumentFolder.REQUEST_DOCUMENTS,
          fileName,
          `${fileName}.pdf`,
          'application/pdf',
          pdf,
        )
      })
      .then(() => {
        return true
      })
      .catch((error) => {
        // Tolerate failure, but log error
        this.logger.warn(
          `Failed to upload request pdf to court for case ${theCase.id}`,
          { error },
        )

        return false
      })
  }

  private getSignedRulingPdf(theCase: Case) {
    return this.awsS3Service.getGeneratedRequestCaseObject(
      theCase.type,
      `${theCase.id}/ruling.pdf`,
    )
  }

  private getSignedCourtRecordPdf(theCase: Case) {
    return this.awsS3Service.getGeneratedRequestCaseObject(
      theCase.type,
      `${theCase.id}/courtRecord.pdf`,
    )
  }

  private async deliverSignedRulingPdfToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<boolean> {
    return this.getSignedRulingPdf(theCase)
      .then((pdf) => this.uploadSignedRulingPdfToCourt(theCase, pdf, user))
      .catch((reason) => {
        this.logger.error(
          `Faild to deliver the ruling for case ${theCase.id} to court`,
          { reason },
        )

        return false
      })
  }

  private async deliverSignedCourtRecordPdfToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<boolean> {
    return this.getSignedCourtRecordPdf(theCase)
      .then((pdf) => this.uploadCourtRecordPdfToCourt(theCase, user, pdf))
      .catch((reason) => {
        this.logger.error(
          `Failed to deliver the signed court record for case ${theCase.id} to court`,
          { reason },
        )

        return false
      })
  }

  async create(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    const users = await this.userService
      .findByNationalId(caseToCreate.prosecutorNationalId)
      .catch(() => undefined)

    // TODO: Sync with LÖKE so we can select the correct user
    const creator = users?.find(
      (user) =>
        isProsecutionUser(user) &&
        (!caseToCreate.prosecutorsOfficeNationalId ||
          user.institution?.nationalId ===
            caseToCreate.prosecutorsOfficeNationalId),
    )

    if (!creator) {
      throw new BadRequestException(
        'Creating user not found or is not registered as a prosecution user',
      )
    }

    if (
      creator.role === UserRole.PROSECUTOR_REPRESENTATIVE &&
      !isIndictmentCase(caseToCreate.type)
    ) {
      throw new BadRequestException(
        'Creating user is registered as a representative and can only create indictments',
      )
    }

    return this.sequelize.transaction(async (transaction) => {
      return this.caseModel
        .create(
          {
            ...caseToCreate,
            state: isRequestCase(caseToCreate.type)
              ? CaseState.NEW
              : CaseState.DRAFT,
            origin: CaseOrigin.LOKE,
            creatingProsecutorId: creator.id,
            prosecutorId:
              creator.role === UserRole.PROSECUTOR ? creator.id : undefined,
            courtId: isRequestCase(caseToCreate.type)
              ? creator.institution?.defaultCourtId
              : undefined,
            prosecutorsOfficeId: creator.institution?.id,
          },
          { transaction },
        )
        .then((theCase) =>
          this.defendantService.createForNewCase(
            theCase.id,
            {
              nationalId: caseToCreate.accusedNationalId,
              dateOfBirth: caseToCreate.accusedDOB,
              name: caseToCreate.accusedName,
              gender: caseToCreate.accusedGender,
              address: (caseToCreate.accusedAddress || '').trim(),
              citizenship: caseToCreate.citizenship,
            },
            transaction,
          ),
        )
        .then(
          (defendant) =>
            this.caseModel.findByPk(defendant.caseId, {
              transaction,
            }) as Promise<Case>,
        )
    })
  }

  async archive(): Promise<ArchiveResponse> {
    const theCase = await this.caseModel.findOne({
      include: [
        { model: Defendant, as: 'defendants' },
        {
          model: IndictmentCount,
          as: 'indictmentCounts',
          include: [
            {
              model: Offense,
              as: 'offenses',
            },
          ],
        },
        { model: CaseFile, as: 'caseFiles' },
        { model: CaseString, as: 'caseStrings' },
      ],
      order: [
        [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
        [{ model: IndictmentCount, as: 'indictmentCounts' }, 'created', 'ASC'],
        [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
        [{ model: CaseString, as: 'caseStrings' }, 'created', 'ASC'],
      ],
      where: archiveFilter,
    })

    if (!theCase) {
      return { caseArchived: false }
    }

    await this.sequelize.transaction(async (transaction) => {
      const [clearedCaseProperties, caseArchive] = collectEncryptionProperties(
        caseEncryptionProperties,
        theCase,
      )

      const defendantsArchive = []
      for (const defendant of theCase.defendants ?? []) {
        const [clearedDefendantProperties, defendantArchive] =
          collectEncryptionProperties(defendantEncryptionProperties, defendant)
        defendantsArchive.push(defendantArchive)

        await this.defendantService.updateDatabaseDefendant(
          theCase.id,
          defendant.id,
          clearedDefendantProperties,
          transaction,
        )
      }

      const caseFilesArchive = []
      for (const caseFile of theCase.caseFiles ?? []) {
        const [clearedCaseFileProperties, caseFileArchive] =
          collectEncryptionProperties(caseFileEncryptionProperties, caseFile)
        caseFilesArchive.push(caseFileArchive)

        await this.fileService.updateCaseFile(
          theCase.id,
          caseFile.id,
          clearedCaseFileProperties,
          transaction,
        )
      }

      const indictmentCountsArchive = []
      for (const count of theCase.indictmentCounts ?? []) {
        const [clearedIndictmentCountProperties, indictmentCountArchive] =
          collectEncryptionProperties(
            indictmentCountEncryptionProperties,
            count,
          )
        indictmentCountsArchive.push(indictmentCountArchive)

        await this.indictmentCountService.update(
          theCase.id,
          count.id,
          clearedIndictmentCountProperties,
          transaction,
        )
      }

      const caseStringsArchive = []
      for (const caseString of theCase.caseStrings ?? []) {
        const [clearedCaseStringProperties, caseStringArchive] =
          collectEncryptionProperties(
            caseStringEncryptionProperties,
            caseString,
          )
        caseStringsArchive.push(caseStringArchive)

        await this.caseStringModel.update(clearedCaseStringProperties, {
          where: { id: caseString.id, caseId: theCase.id },
          transaction,
        })
      }

      await this.caseArchiveModel.create(
        {
          caseId: theCase.id,
          archive: CryptoJS.AES.encrypt(
            JSON.stringify({
              ...caseArchive,
              defendants: defendantsArchive,
              caseFiles: caseFilesArchive,
              indictmentCounts: indictmentCountsArchive,
              caseStrings: caseStringsArchive,
            }),
            this.config.archiveEncryptionKey,
            { iv: CryptoJS.enc.Hex.parse(uuidFactory()) },
          ).toString(),
          // To decrypt:
          // JSON.parse(
          //   Base64.fromBase64(
          //     CryptoJS.AES.decrypt(
          //       archive,
          //       this.config.archiveEncryptionKey,
          //     ).toString(CryptoJS.enc.Base64),
          //   ),
          // )
        },
        { transaction },
      )

      await this.caseModel.update(
        { ...clearedCaseProperties, isArchived: true },
        { where: { id: theCase.id }, transaction },
      )
    })

    this.eventService.postEvent('ARCHIVE', theCase)

    return { caseArchived: true }
  }

  async getCaseHearingArrangements(date: Date): Promise<Case[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    return this.caseModel.findAll({
      include: [
        {
          model: DateLog,
          as: 'dateLogs',
          where: {
            date_type: ['ARRAIGNMENT_DATE', 'COURT_DATE'],
            date: {
              [Op.gte]: startOfDay,
              [Op.lte]: endOfDay,
            },
          },
          required: true,
        },
      ],
      where: { state: { [Op.eq]: CaseState.RECEIVED } },
      order: [[{ model: DateLog, as: 'dateLogs' }, 'date', 'ASC']],
    })
  }

  async deliverProsecutorToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateCaseWithProsecutor(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        theCase.prosecutor?.nationalId ?? '',
        theCase.prosecutorsOffice?.nationalId ?? '',
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update case ${theCase.id} with prosecutor`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.pdfService
      .getIndictmentPdf(theCase)
      .then(async (pdf) => {
        await this.refreshFormatMessage()

        const fileName = this.formatMessage(courtUpload.indictment, {
          courtCaseNumber: theCase.courtCaseNumber,
        })

        return this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId,
          theCase.courtCaseNumber,
          CourtDocumentFolder.INDICTMENT_DOCUMENTS,
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
          `Failed to upload indictment pdf to court for case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentInfoToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const subtypeList = theCase.indictmentSubtypes
      ? Object.values(theCase.indictmentSubtypes).flat()
      : []

    const mappedSubtypes = subtypeList.flatMap((key) => courtSubtypes[key])
    const indictmentIssuedByProsecutorAndReceivedByCourt =
      theCase.eventLogs?.find(
        (eventLog) => eventLog.eventType === EventType.INDICTMENT_CONFIRMED,
      )?.created

    return this.courtService
      .updateIndictmentCaseWithIndictmentInfo(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        indictmentIssuedByProsecutorAndReceivedByCourt,
        indictmentIssuedByProsecutorAndReceivedByCourt,
        theCase.policeCaseNumbers[0],
        mappedSubtypes,
        theCase.defendants?.map((defendant) => ({
          name: defendant.name,
          nationalId: defendant.nationalId,
        })),
        theCase.prosecutor
          ? {
              name: theCase.prosecutor.name,
              nationalId: theCase.prosecutor.nationalId,
              email: theCase.prosecutor.email,
            }
          : undefined,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update indictment case ${theCase.id} with indictment info`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentAssignedRolesToCourt(
    theCase: Case,
    user: TUser,
    nationalId?: string,
  ): Promise<DeliverResponse> {
    const assignedRole =
      theCase.judge?.nationalId === nationalId
        ? {
            name: theCase.judge?.name,
            role: theCase.judge?.role,
          }
        : theCase.registrar?.nationalId === nationalId
        ? {
            name: theCase.registrar?.name,
            role: theCase.registrar?.role,
          }
        : {}

    return this.courtService
      .updateIndictmentCaseWithAssignedRoles(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        assignedRole,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update indictment case ${theCase.id} with assigned roles`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentArraignmentDateToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)?.date
    return this.courtService
      .updateIndictmentCaseWithArraignmentDate(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        arraignmentDate,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update indictment case ${theCase.id} with the arraignment date`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentCancellationNoticeToCourt(
    theCase: Case,
    withCourtCaseNumber: boolean,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const courtCaseNumber = withCourtCaseNumber && theCase.courtCaseNumber
    const caseNumber = courtCaseNumber || theCase.policeCaseNumbers.join(', ')

    return this.courtService
      .updateIndictmentCaseWithCancellationNotice(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        this.formatMessage(notifications.courtRevokedIndictmentEmail.subject, {
          courtCaseNumber: courtCaseNumber || 'NONE',
        }),
        stripHtmlTags(
          `${this.formatMessage(
            notifications.courtRevokedIndictmentEmail.body,
            {
              prosecutorsOffice: theCase.creatingProsecutor?.institution?.name,
              caseNumber,
            },
          )} ${this.formatMessage(notifications.emailTail, {
            linkStart: `<a href="${this.config.clientUrl}">`,
            linkEnd: '</a>',
          })}`,
        ),
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update indictment case ${theCase.id} with cancellation notice`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverCaseFilesRecordToCourt(
    theCase: Case,
    policeCaseNumber: string,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.pdfService
      .getCaseFilesRecordPdf(theCase, policeCaseNumber)
      .then(async (pdf) => {
        await this.refreshFormatMessage()

        const fileName = this.formatMessage(courtUpload.caseFilesRecord, {
          policeCaseNumber,
        })

        return this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId,
          theCase.courtCaseNumber,
          CourtDocumentFolder.CASE_DOCUMENTS,
          fileName,
          `${fileName}.pdf`,
          'application/pdf',
          pdf,
        )
      })
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        // Tolerate failure, but log reason
        this.logger.warn(
          `Failed to upload case files record pdf to court for case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverRequestToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    return this.uploadRequestPdfToCourt(theCase, user).then((delivered) => ({
      delivered,
    }))
  }

  async deliverCourtRecordToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    return this.uploadCourtRecordPdfToCourt(theCase, user).then(
      (delivered) => ({ delivered }),
    )
  }

  async deliverSignedRulingToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    return this.deliverSignedRulingPdfToCourt(theCase, user).then(
      (delivered) => ({ delivered }),
    )
  }

  async deliverSignedCourtRecordToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    return this.deliverSignedCourtRecordPdfToCourt(theCase, user).then(
      (delivered) => ({ delivered }),
    )
  }

  async deliverCaseConclusionToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateCaseWithConclusion(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        Boolean(theCase.rulingModifiedHistory),
        theCase.decision,
        theCase.rulingDate,
        isRestrictionCase(theCase.type) ? theCase.validToDate : undefined,
        theCase.type === CaseType.CUSTODY && theCase.isCustodyIsolation
          ? theCase.isolationToDate
          : undefined,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update case ${theCase.id} with conclusion`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverReceivedDateToCourtOfAppeals(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateAppealCaseWithReceivedDate(
        user,
        theCase.id,
        theCase.appealCaseNumber,
        theCase.appealReceivedByCourtDate,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update appeal case ${theCase.id} with received date`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverAssignedRolesToCourtOfAppeals(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateAppealCaseWithAssignedRoles(
        user,
        theCase.id,
        theCase.appealCaseNumber,
        theCase.appealAssistant?.nationalId,
        theCase.appealAssistant?.name,
        theCase.appealJudge1?.nationalId,
        theCase.appealJudge1?.name,
        theCase.appealJudge2?.nationalId,
        theCase.appealJudge2?.name,
        theCase.appealJudge3?.nationalId,
        theCase.appealJudge3?.name,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update appeal case ${theCase.id} with assigned roles`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverConclusionToCourtOfAppeals(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    // There is no timestamp for appeal ruling, so we use notifications to approximate the time.
    // We know notifications occur in a decending order by time.
    const appealCompletedNotifications = theCase.notifications?.filter(
      (notification) => notification.type === NotificationType.APPEAL_COMPLETED,
    )
    const appealRulingDate =
      appealCompletedNotifications && appealCompletedNotifications.length > 0
        ? appealCompletedNotifications[appealCompletedNotifications.length - 1]
            .created
        : undefined

    return this.courtService
      .updateAppealCaseWithConclusion(
        user,
        theCase.id,
        theCase.appealCaseNumber,
        Boolean(theCase.appealRulingModifiedHistory),
        theCase.appealRulingDecision,
        appealRulingDate,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update appeal case ${theCase.id} with conclusion`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverCaseToPoliceWithFiles(
    theCase: Case,
    user: TUser,
    courtDocuments: PoliceDocument[],
  ): Promise<boolean> {
    const originalAncestor = await this.findOriginalAncestor(theCase)

    const defendantNationalIds = theCase.defendants?.reduce<string[]>(
      (ids, defendant) =>
        !defendant.noNationalId && defendant.nationalId
          ? [...ids, defendant.nationalId]
          : ids,
      [],
    )

    const validToDate =
      (restrictionCases.includes(theCase.type) &&
        theCase.state === CaseState.ACCEPTED &&
        theCase.validToDate) ||
      nowFactory() // The API requires a date so we send now as a dummy date

    return this.policeService.updatePoliceCase(
      user,
      originalAncestor.id,
      theCase.type,
      theCase.state,
      theCase.policeCaseNumbers.length > 0 ? theCase.policeCaseNumbers[0] : '',
      theCase.courtCaseNumber ?? '',
      defendantNationalIds && defendantNationalIds[0]
        ? defendantNationalIds[0].replace('-', '')
        : '',
      validToDate,
      theCase.conclusion ?? '', // Indictments do not have a conclusion
      courtDocuments,
    )
  }

  async deliverCaseToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await this.refreshFormatMessage()
      .then(async () => {
        const courtDocuments = [
          {
            type: PoliceDocumentType.RVKR,
            courtDocument: Base64.btoa(
              await getRequestPdfAsString(theCase, this.formatMessage),
            ),
          },
          {
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(
              await getCourtRecordPdfAsString(theCase, this.formatMessage),
            ),
          },
          ...([CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY].includes(
            theCase.type,
          ) && theCase.state === CaseState.ACCEPTED
            ? [
                {
                  type: PoliceDocumentType.RVVI,
                  courtDocument: Base64.btoa(
                    await getCustodyNoticePdfAsString(
                      theCase,
                      this.formatMessage,
                    ),
                  ),
                },
              ]
            : []),
        ]

        return this.deliverCaseToPoliceWithFiles(theCase, user, courtDocuments)
      })
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to deliver case ${theCase.id} to police`, {
          reason,
        })

        return false
      })

    return { delivered }
  }

  async deliverIndictmentCaseToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await Promise.all(
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.category &&
            [CaseFileCategory.COURT_RECORD, CaseFileCategory.RULING].includes(
              caseFile.category,
            ) &&
            caseFile.key,
        )
        .map(async (caseFile) => {
          // TODO: Tolerate failure, but log error
          const file = await this.fileService.getCaseFileFromS3(
            theCase,
            caseFile,
          )

          return {
            type:
              caseFile.category === CaseFileCategory.COURT_RECORD
                ? PoliceDocumentType.RVTB
                : PoliceDocumentType.RVDO,
            courtDocument: Base64.btoa(file.toString('binary')),
          }
        }) ?? [],
    )
      .then((courtDocuments) =>
        this.deliverCaseToPoliceWithFiles(theCase, user, courtDocuments),
      )
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to deliver case ${theCase.id} to police`, {
          reason,
        })

        return false
      })

    return { delivered }
  }

  async deliverIndictmentToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    try {
      const file = await this.pdfService.getIndictmentPdf(theCase)

      const policeDocuments = [
        {
          type: PoliceDocumentType.RVAS,
          courtDocument: Base64.btoa(file.toString('binary')),
        },
      ]

      const delivered = await this.deliverCaseToPoliceWithFiles(
        theCase,
        user,
        policeDocuments,
      )

      return { delivered }
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to deliver indictment for case ${theCase.id} to police`,
        { error },
      )

      return { delivered: false }
    }
  }

  async deliverCaseFilesRecordToPolice(
    theCase: Case,
    policeCaseNumber: string,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await this.pdfService
      .getCaseFilesRecordPdf(theCase, policeCaseNumber)
      .then((pdf) =>
        this.deliverCaseToPoliceWithFiles(theCase, user, [
          {
            type: PoliceDocumentType.RVMG,
            courtDocument: Base64.btoa(pdf.toString('binary')),
          },
        ]),
      )
      .catch((error) => {
        // Tolerate failure, but log error
        this.logger.warn(
          `Failed to deliver case files record pdf to police for case ${theCase.id}`,
          { error },
        )

        return false
      })

    return { delivered }
  }

  async deliverSignedCourtRecordToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await this.getSignedCourtRecordPdf(theCase)
      .then((pdf) =>
        this.deliverCaseToPoliceWithFiles(theCase, user, [
          {
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(pdf.toString('binary')),
          },
        ]),
      )
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(
          `Failed to deliver signed court record for case ${theCase.id} to police`,
          { reason },
        )

        return false
      })

    return { delivered }
  }

  async deliverSignedRulingToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await this.getSignedRulingPdf(theCase)
      .then((pdf) =>
        this.deliverCaseToPoliceWithFiles(theCase, user, [
          {
            type: PoliceDocumentType.RVUR,
            courtDocument: Base64.btoa(pdf.toString('binary')),
          },
        ]),
      )
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(
          `Failed to deliver signed ruling for case ${theCase.id} to police`,
          { reason },
        )

        return false
      })

    return { delivered }
  }

  async deliverAppealToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    const delivered = await Promise.all(
      theCase.caseFiles
        ?.filter((file) => file.category === CaseFileCategory.APPEAL_RULING)
        .map(async (caseFile) => {
          // TODO: Tolerate failure, but log error
          const file = await this.fileService.getCaseFileFromS3(
            theCase,
            caseFile,
          )

          return {
            type: PoliceDocumentType.RVUL,
            courtDocument: Base64.btoa(file.toString('binary')),
          }
        }) ?? [],
    )
      .then(async (courtDocuments) =>
        this.deliverCaseToPoliceWithFiles(theCase, user, courtDocuments),
      )
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(
          `Failed to deliver appeal for case ${theCase.id} to police`,
          { reason },
        )

        return false
      })

    return { delivered }
  }

  async findOriginalAncestor(theCase: Case): Promise<Case> {
    let originalAncestor: Case = theCase

    while (originalAncestor.parentCaseId) {
      const parentCase = await this.caseModel.findByPk(
        originalAncestor.parentCaseId,
      )

      if (!parentCase) {
        throw new InternalServerErrorException(
          `Original ancestor of case ${theCase.id} not found`,
        )
      }

      originalAncestor = parentCase
    }

    return originalAncestor
  }

  // As this is only currently used by the digital mailbox API
  // we will only return indictment cases that have a court date
  async getAllDefendantIndictmentCases(nationalId: string): Promise<Case[]> {
    return this.caseModel.findAll({
      include: [
        {
          model: Defendant,
          as: 'defendants',
        },
        {
          model: DateLog,
          as: 'dateLogs',
          where: {
            date_type: 'ARRAIGNMENT_DATE',
          },
          required: true,
        },
      ],
      order: [[{ model: DateLog, as: 'dateLogs' }, 'created', 'DESC']],
      attributes: ['id', 'courtCaseNumber', 'type', 'state'],
      where: {
        type: CaseType.INDICTMENT,
        // Make sure we don't send cases that are in deleted or other inaccessible states
        state: [
          CaseState.RECEIVED,
          CaseState.COMPLETED,
          CaseState.WAITING_FOR_CANCELLATION,
        ],
        // The national id could be without a hyphen or with a hyphen so we need to
        // search for both
        '$defendants.national_id$': normalizeAndFormatNationalId(nationalId),
      },
    })
  }

  async findByIdAndDefendantNationalId(
    caseId: string,
    defendantNationalId: string,
  ): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include: [
        {
          model: Defendant,
          as: 'defendants',
          include: [
            {
              model: Subpoena,
              as: 'subpoenas',
              order: [['created', 'DESC']],
            },
          ],
        },
        { model: Institution, as: 'court' },
        { model: Institution, as: 'prosecutorsOffice' },
        { model: User, as: 'judge' },
        {
          model: User,
          as: 'prosecutor',
          include: [{ model: Institution, as: 'institution' }],
        },
        { model: DateLog, as: 'dateLogs' },
      ],
      attributes: [
        'courtCaseNumber',
        'id',
        'state',
        'indictmentRulingDecision',
        'rulingDate',
      ],
      where: {
        type: CaseType.INDICTMENT,
        id: caseId,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
        // This select only defendants with the given national id, other defendants are not included
        '$defendants.national_id$':
          normalizeAndFormatNationalId(defendantNationalId),
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async getDefendantIndictmentCase(
    theCase: Case,
    defendantNationalId: string,
  ): Promise<Case> {
    const subpoena = theCase.defendants?.[0].subpoenas?.[0]

    if (!subpoena) {
      return theCase
    }

    const latestSubpoena = await this.subpoenaService.getSubpoena(subpoena)

    if (latestSubpoena === subpoena) {
      // The subpoena was up to date
      return theCase
    }

    return this.findByIdAndDefendantNationalId(theCase.id, defendantNationalId)
  }

  countIndictmentsWaitingForConfirmation(prosecutorsOfficeId: string) {
    return this.caseModel.count({
      include: [{ model: User, as: 'creatingProsecutor' }],
      where: {
        type: CaseType.INDICTMENT,
        state: CaseState.WAITING_FOR_CONFIRMATION,
        '$creatingProsecutor.institution_id$': prosecutorsOfficeId,
      },
    })
  }
}
