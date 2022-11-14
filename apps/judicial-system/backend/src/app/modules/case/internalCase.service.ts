import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import { Sequelize } from 'sequelize-typescript'

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
import { EmailService } from '@island.is/email-service'
import { caseTypes } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  IndictmentSubType,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { uuidFactory } from '../../factories'
import {
  stripHtmlTags,
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  formatCourtUploadRulingTitle,
  getRequestPdfAsBuffer,
} from '../../formatters'
import { courtUpload } from '../../messages'
import { CaseEvent, EventService } from '../event'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { PoliceService } from '../police'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { Defendant, DefendantService } from '../defendant'
import { CaseFile, FileService } from '../file'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { oldFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { ArchiveResponse } from './models/archive.response'
import { DeliverCompletedCaseResponse } from './models/deliverCompletedCase.response'
import { DeliverProsecutorDocumentsResponse } from './models/deliverProsecutorDocuments.response'
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
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
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
    user?: TUser,
  ): Promise<boolean> {
    const fileName = formatCourtUploadRulingTitle(
      this.formatMessage,
      theCase.courtCaseNumber,
      Boolean(theCase.rulingModifiedHistory),
    )

    try {
      await this.courtService.createDocument(
        theCase.id,
        theCase.courtId,
        theCase.courtCaseNumber,
        CourtDocumentFolder.COURT_DOCUMENTS,
        fileName,
        `${fileName}.pdf`,
        'application/pdf',
        buffer,
        user,
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

  private async uploadCourtRecordPdfToCourt(theCase: Case): Promise<boolean> {
    try {
      const pdf = await getCourtRecordPdfAsBuffer(theCase, this.formatMessage)

      const fileName = this.formatMessage(courtUpload.courtRecord, {
        courtCaseNumber: theCase.courtCaseNumber,
      })

      await this.courtService.createDocument(
        theCase.id,
        theCase.courtId,
        theCase.courtCaseNumber,
        CourtDocumentFolder.COURT_DOCUMENTS,
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

  private async upploadRequestPdfToCourt(theCase: Case): Promise<boolean> {
    return getRequestPdfAsBuffer(theCase, this.formatMessage)
      .then((pdf) => {
        const fileName = this.formatMessage(courtUpload.request, {
          caseType: caseTypes[theCase.type],
          date: '',
        })

        return this.courtService.createDocument(
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

  private async sendEmailToCourt(theCase: Case, subject: string, body: string) {
    const to = [
      {
        name: theCase.judge?.name ?? '',
        address: theCase.judge?.email ?? '',
      },
    ]
    if (theCase.registrar) {
      to.push({
        name: theCase.registrar?.name ?? '',
        address: theCase.registrar?.email ?? '',
      })
    }

    try {
      await this.emailService.sendEmail({
        from: {
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        replyTo: {
          name: this.config.email.replyToName,
          address: this.config.email.replyToEmail,
        },
        to: to,
        subject,
        text: stripHtmlTags(body),
        html: body,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: to.reduce(
            (acc, recipient, index) =>
              index > 0
                ? `${acc}, ${recipient.name} (${recipient.address})`
                : `${recipient.name} (${recipient.address})`,
            '',
          ),
        },
        error as Error,
      )
    }
  }

  private async deliverCaseFilesToCourt(
    theCase: Case,
    caseFileCategories?: CaseFileCategory[],
  ): Promise<boolean> {
    let success = true

    try {
      const caseFiles = theCase.caseFiles ?? []

      for (const caseFile of caseFiles.filter(
        (caseFile) =>
          !caseFile.category || caseFileCategories?.includes(caseFile.category),
      )) {
        const uploaded = await this.fileService
          .uploadCaseFileToCourt(caseFile, theCase)
          .then((response) => response.success)
          .catch((reason) => {
            this.logger.error(
              `Failed to deliver ${
                caseFile.category ?? CaseFileCategory.CASE_FILE
              } ${caseFile.id} of case ${theCase.id} to court`,
              { reason },
            )

            return false
          })

        success = success && uploaded
      }
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to deliver files of case ${theCase.id} to court`,
        { error },
      )

      success = false
    }

    return success
  }

  private async deliverSignedRulingPdfToCourt(theCase: Case): Promise<boolean> {
    return this.awsS3Service
      .getObject(`generated/${theCase.id}/ruling.pdf`)
      .then((pdf) => this.uploadSignedRulingPdfToCourt(theCase, pdf))
      .catch((reason) => {
        this.logger.error(
          `Faild to deliver the ruling for case ${theCase.id} to court`,
          { reason },
        )

        return false
      })
  }

  private async deliverProsecutorDocumentsToCourt(
    theCase: Case,
  ): Promise<boolean> {
    return isIndictmentCase(theCase.type)
      ? await this.deliverCaseFilesToCourt(theCase, [
          CaseFileCategory.COVER_LETTER,
          CaseFileCategory.INDICTMENT,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.COST_BREAKDOWN,
          CaseFileCategory.CASE_FILE_CONTENTS,
          CaseFileCategory.CASE_FILE,
        ])
      : await this.upploadRequestPdfToCourt(theCase)
  }

  private async getIndictmentCourtRecordAsString(
    theCase: Case,
  ): Promise<string> {
    const caseFile = theCase.caseFiles?.find(
      (caseFile) => caseFile.category === CaseFileCategory.COURT_RECORD,
    )

    if (!caseFile) {
      throw new Error(
        `Failed to find the court record for case ${theCase.id} in the database`,
      )
    }

    if (!caseFile.key) {
      throw new Error(
        `Missing AWS S3 key for the court record of case ${theCase.id}`,
      )
    }

    return this.awsS3Service
      .getObject(caseFile.key)
      .then((buffer) => buffer.toString('binary'))
  }

  private getCourtRecordAsString(theCase: Case) {
    return isIndictmentCase(theCase.type)
      ? this.getIndictmentCourtRecordAsString(theCase)
      : getCourtRecordPdfAsString(theCase, this.formatMessage)
  }

  private async deliverCaseToPolice(theCase: Case): Promise<boolean> {
    return this.getCourtRecordAsString(theCase)
      .then(async (courtRecord) => {
        const defendantNationalIds = theCase.defendants?.reduce<string[]>(
          (ids, defendant) =>
            !defendant.noNationalId && defendant.nationalId
              ? [...ids, defendant.nationalId]
              : ids,
          [],
        )

        return this.policeService.updatePoliceCase(
          theCase.id,
          isIndictmentCase(theCase.type)
            ? (theCase.indictmentSubType as IndictmentSubType) // We know the sub type is set if the case is an indictment case
            : theCase.type,
          theCase.state,
          courtRecord,
          theCase.policeCaseNumbers,
          defendantNationalIds,
          theCase.conclusion,
        )
      })
      .catch((reason) => {
        // Tolerate failure, but log error
        this.logger.error(`Failed to deliver case ${theCase.id} to police`, {
          reason,
        })

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
        {
          model: CaseFile,
          as: 'caseFiles',
          required: false,
          where: { state: { [Op.not]: CaseFileState.DELETED } },
        },
      ],
      order: [
        [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
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

  async deliver(theCase: Case): Promise<DeliverCompletedCaseResponse> {
    await this.refreshFormatMessage()

    const caseFilesDeliveredToCourt =
      isIndictmentCase(theCase.type) ||
      Boolean(theCase.rulingModifiedHistory) || // case files did not change
      (await this.deliverCaseFilesToCourt(theCase))

    const caseDeliveredToPolice =
      theCase.origin === CaseOrigin.LOKE &&
      (Boolean(theCase.rulingModifiedHistory) || // no relevant changes
        (await this.deliverCaseToPolice(theCase)))

    return {
      caseFilesDeliveredToCourt,
      caseDeliveredToPolice,
    }
  }

  async deliverProsecutorDocuments(
    theCase: Case,
  ): Promise<DeliverProsecutorDocumentsResponse> {
    await this.refreshFormatMessage()

    const requestDeliveredToCourt = await this.deliverProsecutorDocumentsToCourt(
      theCase,
    )

    return {
      requestDeliveredToCourt,
    }
  }

  async deliverCourtRecordToCourt(theCase: Case): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.uploadCourtRecordPdfToCourt(theCase)

    return { delivered }
  }

  async deliverSignedRulingToCourt(theCase: Case): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const delivered = await this.deliverSignedRulingPdfToCourt(theCase)

    return { delivered }
  }
}
