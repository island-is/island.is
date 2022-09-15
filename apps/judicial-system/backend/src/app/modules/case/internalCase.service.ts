import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import { Sequelize } from 'sequelize-typescript'
import format from 'date-fns/format'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { caseTypes } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'

import { uuidFactory, nowFactory } from '../../factories'
import {
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  formatCourtUploadRulingTitle,
  getRequestPdfAsBuffer,
  createCaseFilesRecord,
} from '../../formatters'
import { courtUpload } from '../../messages'
import { CaseEvent, EventService } from '../event'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { PoliceService } from '../police'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { Defendant, DefendantService } from '../defendant'
import { IndictmentCount } from '../indictment-count'
import { CaseFile, FileService } from '../file'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { oldFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { ArchiveResponse } from './models/archive.response'
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
    user: User,
  ): Promise<boolean> {
    const fileName = formatCourtUploadRulingTitle(
      this.formatMessage,
      theCase.courtCaseNumber,
      Boolean(theCase.rulingModifiedHistory),
    )

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
    user: User,
  ): Promise<boolean> {
    try {
      const pdf = await getCourtRecordPdfAsBuffer(theCase, this.formatMessage)

      const fileName = this.formatMessage(courtUpload.courtRecord, {
        courtCaseNumber: theCase.courtCaseNumber,
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
    user: User,
  ): Promise<boolean> {
    return getRequestPdfAsBuffer(theCase, this.formatMessage)
      .then((pdf) => {
        const fileName = this.formatMessage(courtUpload.request, {
          caseType: caseTypes[theCase.type],
          date: ` ${format(nowFactory(), 'yyyy-MM-dd HH:mm')}`,
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

  private async uploadCaseFilesRecordPdfToCourt(
    theCase: Case,
    policeCaseNumber: string,
    user: User,
  ): Promise<boolean> {
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

    return createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles ?? [],
      this.formatMessage,
    )
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
          `Failed to upload request pdf to court for case ${theCase.id}`,
          { error },
        )

        return false
      })
  }

  private async deliverSignedRulingPdfToCourt(
    theCase: Case,
    user: User,
  ): Promise<boolean> {
    return this.awsS3Service
      .getObject(`generated/${theCase.id}/ruling.pdf`)
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
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${
            prosecutor?.id ?? 'unknown'
          } is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
      courtId = prosecutor.institution?.defaultCourtId
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
          this.defendantService.create(
            theCase.id,
            {
              nationalId: caseToCreate.accusedNationalId,
              name: caseToCreate.accusedName,
              gender: caseToCreate.accusedGender,
              address: caseToCreate.accusedAddress,
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
        [Op.or]: [{ state: CaseState.DELETED }, oldFilter],
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
        const [
          clearedDefendantProperties,
          defendantArchive,
        ] = collectEncryptionProperties(
          defendantEncryptionProperties,
          defendant,
        )
        defendantsArchive.push(defendantArchive)

        await this.defendantService.update(
          theCase.id,
          defendant.id,
          clearedDefendantProperties,
          transaction,
        )
      }

      const caseFilesArchive = []
      for (const caseFile of theCase.caseFiles ?? []) {
        const [
          clearedCaseFileProperties,
          caseFileArchive,
        ] = collectEncryptionProperties(caseFileEncryptionProperties, caseFile)
        caseFilesArchive.push(caseFileArchive)

        await this.fileService.updateCaseFile(
          theCase.id,
          caseFile.id,
          clearedCaseFileProperties,
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
    user: User,
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
        this.logger.error('Failed to update case with defendant', { reason })

        return { delivered: false }
      })
  }

  async deliverCaseFilesRecordToCourt(
    theCase: Case,
    policeCaseNumber: string,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.uploadCaseFilesRecordPdfToCourt(
      theCase,
      policeCaseNumber,
      user,
    )

    return { delivered }
  }

  async deliverRequestToCourt(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.upploadRequestPdfToCourt(theCase, user)

    return { delivered }
  }

  async deliverCourtRecordToCourt(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.uploadCourtRecordPdfToCourt(theCase, user)

    return { delivered }
  }

  async deliverSignedRulingToCourt(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.deliverSignedRulingPdfToCourt(theCase, user)

    return { delivered }
  }

  async deliverCaseToPolice(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    return getCourtRecordPdfAsString(theCase, this.formatMessage)
      .then(async (courtRecord) => {
        const defendantNationalIds = theCase.defendants?.reduce<string[]>(
          (ids, defendant) =>
            !defendant.noNationalId && defendant.nationalId
              ? [...ids, defendant.nationalId]
              : ids,
          [],
        )

        const delivered = await this.policeService.updatePoliceCase(
          user,
          theCase.id,
          theCase.type,
          theCase.state,
          courtRecord,
          theCase.policeCaseNumbers.length > 0
            ? theCase.policeCaseNumbers[0]
            : '',
          defendantNationalIds,
          theCase.conclusion,
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
}
