import CryptoJS from 'crypto-js'
import format from 'date-fns/format'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { caseTypes } from '@island.is/judicial-system/formatters'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  completedCaseStates,
  isIndictmentCase,
  isRestrictionCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import {
  createCaseFilesRecord,
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  getCustodyNoticePdfAsString,
  getRequestPdfAsBuffer,
  getRequestPdfAsString,
} from '../../formatters'
import { courtUpload } from '../../messages'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { Defendant, DefendantService } from '../defendant'
import { CaseEvent, EventService } from '../event'
import { CaseFile, FileService } from '../file'
import { IndictmentCount, IndictmentCountService } from '../indictment-count'
import { Institution } from '../institution'
import { PoliceService } from '../police'
import { User, UserService } from '../user'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { archiveFilter } from './filters/case.archiveFilter'
import { ArchiveResponse } from './models/archive.response'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { DeliverResponse } from './models/deliver.response'
import { caseModuleConfig } from './case.config'

const caseEncryptionProperties: (keyof Case)[] = [
  'description',
  'demands',
  'lawsBroken',
  'legalBasis',
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

function collectEncryptionProperties(
  properties: string[],
  unknownSource: unknown,
): [{ [key: string]: string | null }, { [key: string]: unknown }] {
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
      this.logger.error(
        `Failed to upload signed ruling pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async uploadCourtRecordPdfToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<boolean> {
    try {
      const pdf = await getCourtRecordPdfAsBuffer(theCase, this.formatMessage)

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
      this.logger.error(
        `Failed to upload court record pdf to court for case ${theCase.id}`,
        { error },
      )

      return false
    }
  }

  private async upploadRequestPdfToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<boolean> {
    return getRequestPdfAsBuffer(theCase, this.formatMessage)
      .then((pdf) => {
        const fileName = this.formatMessage(courtUpload.request, {
          caseType: caseTypes[theCase.type],
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
        this.logger.error(
          `Failed to upload request pdf to court for case ${theCase.id}`,
          { error },
        )

        return false
      })
  }

  private async getCaseFilesRecordPdf(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<Buffer> {
    if (completedCaseStates.includes(theCase.state)) {
      try {
        return await this.awsS3Service.getObject(
          `indictments/completed/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        )
      } catch {
        // Ignore the error and try the original key
      }
    }

    try {
      return await this.awsS3Service.getObject(
        `indictments/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
    } catch {
      // Ignore the error and generate the pdf
    }

    const caseFiles = theCase.caseFiles
      ?.filter(
        (caseFile) =>
          caseFile.policeCaseNumber === policeCaseNumber &&
          caseFile.category === CaseFileCategory.CASE_FILE &&
          caseFile.type === 'application/pdf' &&
          caseFile.key &&
          caseFile.chapter !== null &&
          caseFile.orderWithinChapter !== null,
      )
      ?.sort(
        (caseFile1, caseFile2) =>
          (caseFile1.chapter ?? 0) - (caseFile2.chapter ?? 0) ||
          (caseFile1.orderWithinChapter ?? 0) -
            (caseFile2.orderWithinChapter ?? 0),
      )
      ?.map((caseFile) => async () => {
        const buffer = await this.awsS3Service
          .getObject(caseFile.key ?? '')
          .catch((reason) => {
            // Tolerate failure, but log error
            this.logger.error(
              `Unable to get file ${caseFile.id} of case ${theCase.id} from AWS S3`,
              { reason },
            )
          })

        return {
          chapter: caseFile.chapter as number,
          date: caseFile.displayDate ?? caseFile.created,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          buffer: buffer ?? undefined,
        }
      })

    const pdf = await createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles ?? [],
      this.formatMessage,
    )

    await this.awsS3Service
      .putObject(
        `indictments/${
          completedCaseStates.includes(theCase.state) ? 'completed/' : ''
        }${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        pdf.toString('binary'),
      )
      .catch((reason) => {
        this.logger.error(
          `Failed to upload case files record pdf to AWS S3 for case ${theCase.id} and police case ${policeCaseNumber}`,
          { reason },
        )
      })

    return pdf
  }

  private async throttleUploadCaseFilesRecordPdfToCourt(
    theCase: Case,
    policeCaseNumber: string,
    user: TUser,
  ): Promise<boolean> {
    // Serialize all case files pdf uploads in this process
    await this.throttle.catch((reason) => {
      this.logger.info('Previous case files pdf generation failed', { reason })
    })

    await this.refreshFormatMessage()

    const pdfPromise = this.getCaseFilesRecordPdf(theCase, policeCaseNumber)

    return pdfPromise
      .then((pdf) => {
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
      .then(() => {
        return true
      })
      .catch((error) => {
        // Tolerate failure, but log error
        this.logger.error(
          `Failed to upload case files record pdf to court for case ${theCase.id}`,
          { error },
        )

        return false
      })
  }

  private getSignedRulingPdf(theCase: Case) {
    return this.awsS3Service.getObject(`generated/${theCase.id}/ruling.pdf`)
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

  async create(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined
    let courtId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService
        .findByNationalId(caseToCreate.prosecutorNationalId)
        .catch(() => undefined) // Tolerate failure

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        const errorMessage = `User ${
          prosecutor?.id ?? 'unknown'
        } is not registered as a prosecutor`
        // Tolerate failure, but log error
        this.logger.error(errorMessage)
        // Unless case is marked with heightened security, then we won't tolerate failure
        if (caseToCreate.isHeightenedSecurityLevel === true) {
          throw new BadRequestException(errorMessage)
        }
      } else {
        prosecutorId = prosecutor.id
        courtId = prosecutor.institution?.defaultCourtId
      }
    }

    return this.sequelize.transaction(async (transaction) => {
      return this.caseModel
        .create(
          {
            ...caseToCreate,
            state: isIndictmentCase(caseToCreate.type)
              ? CaseState.DRAFT
              : undefined,
            origin: CaseOrigin.LOKE,
            creatingProsecutorId: prosecutorId,
            prosecutorId,
            courtId,
          },
          { transaction },
        )
        .then((theCase) =>
          this.defendantService.createForNewCase(
            theCase.id,
            {
              nationalId: caseToCreate.accusedNationalId,
              name: caseToCreate.accusedName,
              gender: caseToCreate.accusedGender,
              address: caseToCreate.accusedAddress,
              citizenship: caseToCreate.citizenship,
            },
            transaction,
          ),
        )
        .then(
          (defendant) =>
            this.caseModel.findByPk(defendant.caseId, {
              include: [
                { model: Institution, as: 'court' },
                {
                  model: User,
                  as: 'creatingProsecutor',
                  include: [{ model: Institution, as: 'institution' }],
                },
                {
                  model: User,
                  as: 'prosecutor',
                  include: [{ model: Institution, as: 'institution' }],
                },
              ],
              transaction,
            }) as Promise<Case>,
        )
    })
  }

  async archive(): Promise<ArchiveResponse> {
    const theCase = await this.caseModel.findOne({
      include: [
        { model: Defendant, as: 'defendants' },
        { model: IndictmentCount, as: 'indictmentCounts' },
        { model: CaseFile, as: 'caseFiles' },
      ],
      order: [
        [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
        [{ model: IndictmentCount, as: 'indictmentCounts' }, 'created', 'ASC'],
        [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
      ],
      where: {
        isArchived: false,
        [Op.or]: [{ state: CaseState.DELETED }, archiveFilter],
      },
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

        await this.defendantService.updateForArcive(
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

      await this.caseArchiveModel.create(
        {
          caseId: theCase.id,
          archive: CryptoJS.AES.encrypt(
            JSON.stringify({
              ...caseArchive,
              defendants: defendantsArchive,
              caseFiles: caseFilesArchive,
              indictmentCounts: indictmentCountsArchive,
            }),
            this.config.archiveEncryptionKey,
            { iv: CryptoJS.enc.Hex.parse(uuidFactory()) },
          ).toString(),
        },
        { transaction },
      )

      await this.caseModel.update(
        { ...clearedCaseProperties, isArchived: true },
        { where: { id: theCase.id }, transaction },
      )
    })

    this.eventService.postEvent(CaseEvent.ARCHIVE, theCase)

    return { caseArchived: true }
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
        theCase.creatingProsecutor?.institution?.nationalId ?? '',
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error('Failed to update case with prosecutor', { reason })

        return { delivered: false }
      })
  }

  async deliverCaseFilesRecordToCourt(
    theCase: Case,
    policeCaseNumber: string,
    user: TUser,
  ): Promise<DeliverResponse> {
    this.throttle = this.throttleUploadCaseFilesRecordPdfToCourt(
      theCase,
      policeCaseNumber,
      user,
    )

    const delivered = await this.throttle

    return { delivered }
  }

  async archiveCaseFilesRecord(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<DeliverResponse> {
    return this.awsS3Service
      .copyObject(
        `indictments/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        `indictments/completed/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      .then(() => {
        // Fire and forget, no need to wait for the result
        this.awsS3Service
          .deleteObject(
            `indictments/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
          )
          .catch((reason) => {
            // Tolerate failure, but log what happened
            this.logger.error(
              `Could not delete case files record for case ${theCase.id} and police case ${policeCaseNumber} from AWS S3`,
              { reason },
            )
          })

        return { delivered: true }
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to archive case files record for case ${theCase.id} and police case ${policeCaseNumber}`,
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

    const delivered = await this.upploadRequestPdfToCourt(theCase, user)

    return { delivered }
  }

  async deliverCourtRecordToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.uploadCourtRecordPdfToCourt(theCase, user)

    return { delivered }
  }

  async deliverSignedRulingToCourt(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.deliverSignedRulingPdfToCourt(theCase, user)

    return { delivered }
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
        theCase.decision,
        theCase.rulingDate,
        isRestrictionCase(theCase.type) ? theCase.validToDate : undefined,
        theCase.type === CaseType.CUSTODY && theCase.isCustodyIsolation
          ? theCase.isolationToDate
          : undefined,
      )
      .then(() => ({ delivered: true }))
  }

  async deliverCaseToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.refreshFormatMessage()
      .then(async () => {
        const requestPdf = await getRequestPdfAsString(
          theCase,
          this.formatMessage,
        )
        const courtRecordPdf = await getCourtRecordPdfAsString(
          theCase,
          this.formatMessage,
        )
        const rulingPdf = await this.getSignedRulingPdf(theCase).then((pdf) =>
          pdf.toString('binary'),
        )
        const custodyNoticePdf =
          [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY].includes(
            theCase.type,
          ) && theCase.state === CaseState.ACCEPTED
            ? await getCustodyNoticePdfAsString(theCase, this.formatMessage)
            : undefined
        const defendantNationalIds = theCase.defendants?.reduce<string[]>(
          (ids, defendant) =>
            !defendant.noNationalId && defendant.nationalId
              ? [...ids, defendant.nationalId]
              : ids,
          [],
        )
        const validToDate =
          ([
            CaseType.CUSTODY,
            CaseType.ADMISSION_TO_FACILITY,
            CaseType.TRAVEL_BAN,
          ].includes(theCase.type) &&
            theCase.state === CaseState.ACCEPTED &&
            theCase.validToDate) ||
          new Date() // The API requires a date so we send 1970-01-01T00:00:00.000Z as a dummy date

        const originalAncestor = await this.findOriginalAncestor(theCase)

        const delivered = await this.policeService.updatePoliceCase(
          user,
          originalAncestor.id,
          theCase.type,
          theCase.state,
          theCase.policeCaseNumbers.length > 0
            ? theCase.policeCaseNumbers[0]
            : '',
          defendantNationalIds && defendantNationalIds[0]
            ? defendantNationalIds[0].replace('-', '')
            : '',
          validToDate,
          theCase.conclusion ?? '',
          requestPdf as string,
          courtRecordPdf as string,
          rulingPdf as string,
          custodyNoticePdf,
          undefined,
        )

        return { delivered }
      })
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to deliver case ${theCase.id} to police`, {
          reason,
        })

        return { delivered: false }
      })
  }

  async deliverAppealToPolice(
    theCase: Case,
    user: TUser,
  ): Promise<DeliverResponse> {
    return this.refreshFormatMessage()
      .then(async () => {
        const appealRuling =
          theCase.appealState === CaseAppealState.COMPLETED && theCase.caseFiles
            ? await Promise.all(
                theCase.caseFiles
                  .filter(
                    (file) => file.category === CaseFileCategory.APPEAL_RULING,
                  )
                  .map((file) =>
                    this.awsS3Service
                      .getObject(file.key ?? '')
                      .then((pdf) => pdf.toString('binary')),
                  ),
              )
            : []
        const defendantNationalIds = theCase.defendants?.reduce<string[]>(
          (ids, defendant) =>
            !defendant.noNationalId && defendant.nationalId
              ? [...ids, defendant.nationalId]
              : ids,
          [],
        )
        const validToDate =
          ([
            CaseType.CUSTODY,
            CaseType.ADMISSION_TO_FACILITY,
            CaseType.TRAVEL_BAN,
          ].includes(theCase.type) &&
            theCase.state === CaseState.ACCEPTED &&
            theCase.validToDate) ||
          new Date() // The API requires a date so we send 1970-01-01T00:00:00.000Z as a dummy date

        const originalAncestor = await this.findOriginalAncestor(theCase)

        const delivered = await this.policeService.updatePoliceCase(
          user,
          originalAncestor.id,
          theCase.type,
          theCase.state,
          theCase.policeCaseNumbers.length > 0
            ? theCase.policeCaseNumbers[0]
            : '',
          defendantNationalIds && defendantNationalIds[0]
            ? defendantNationalIds[0].replace('-', '')
            : '',
          validToDate,
          theCase.conclusion ?? '',
          undefined,
          undefined,
          undefined,
          undefined,
          appealRuling,
        )

        return { delivered }
      })
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(
          `Failed to deliver appeal for case ${theCase.id} to police`,
          { reason },
        )

        return { delivered: false }
      })
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
}
