import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import { Includeable, OrderItem, Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'
import { Attachment } from 'nodemailer/lib/mailer'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import {
  CaseOrigin,
  CaseState,
  isRestrictionCase,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import {
  getRequestPdfAsBuffer,
  getRulingPdfAsString,
  getCasefilesPdfAsString,
  writeFile,
  getRulingPdfAsBuffer,
  getCustodyNoticePdfAsBuffer,
  stripHtmlTags,
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
  formatCourtUploadRulingTitle,
  formatRulingModifiedHistory,
} from '../../formatters'
import { courtUpload, notifications as m } from '../../messages'
import { CaseFile, FileService } from '../file'
import { DefendantService, Defendant } from '../defendant'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CaseEvent, EventService } from '../event'
import { CreateCaseDto } from './dto/createCase.dto'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { getCasesQueryFilter, oldFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { ArchiveResponse } from './models/archive.response'
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

const caseFileEncryptionProperties: (keyof CaseFile)[] = ['name', 'key']

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

interface Recipient {
  name: string
  address: string
}

const includes: Includeable[] = [
  { model: Defendant, as: 'defendants' },
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
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase' },
  { model: Case, as: 'childCase' },
]

const defendantsOrder: OrderItem = [
  { model: Defendant, as: 'defendants' },
  'created',
  'ASC',
]

@Injectable()
export class CaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private refreshFormatMessage: () => Promise<void> = async () =>
    this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })

  private async uploadSignedRulingPdfToS3(
    theCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putObject(`generated/${theCase.id}/ruling.pdf`, pdf)
      .then(() => true)
      .catch((reason) => {
        this.logger.error(
          `Failed to upload signed ruling pdf to AWS S3 for case ${theCase.id}`,
          { reason },
        )

        return false
      })
  }

  private async uploadSignedRulingPdfToCourt(
    theCase: Case,
    user: TUser,
    pdf: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Uploading signed ruling pdf to court for case ${theCase.id}`,
    )

    if (!this.config.production) {
      writeFile(`${theCase.id}-ruling-signed.pdf`, pdf)
    }

    const buffer = Buffer.from(pdf, 'binary')

    try {
      await this.courtService.createRuling(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        formatCourtUploadRulingTitle(
          this.formatMessage,
          theCase.courtCaseNumber,
          Boolean(theCase.rulingDate),
        ),
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
    pdf: string,
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Uploading court record pdf to court for case ${theCase.id}`,
      )
      if (!this.config.production) {
        writeFile(`${theCase.id}-court-record.pdf`, pdf)
      }

      const buffer = Buffer.from(pdf, 'binary')

      await this.courtService.createCourtRecord(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        this.formatMessage(courtUpload.courtRecord, {
          courtCaseNumber: theCase.courtCaseNumber,
        }),
        buffer,
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

  private async uploadCaseFilesPdfToCourt(theCase: Case, user: TUser) {
    try {
      theCase.caseFiles = await this.fileService.getAllCaseFiles(theCase.id)

      if (theCase.caseFiles && theCase.caseFiles.length > 0) {
        this.logger.debug(
          `Uploading case files overview pdf to court for case ${theCase.id}`,
        )

        const caseFilesPdf = await getCasefilesPdfAsString(theCase)

        if (!this.config.production) {
          writeFile(`${theCase.id}-case-files.pdf`, caseFilesPdf)
        }

        const buffer = Buffer.from(caseFilesPdf, 'binary')

        await this.courtService.createDocument(
          user,
          theCase.id,
          theCase.courtId ?? '',
          theCase.courtCaseNumber ?? '',
          'Rannsóknargögn',
          'Rannsóknargögn.pdf',
          'application/pdf',
          buffer,
        )
      }
    } catch (error) {
      // Log and ignore this error. The overview is not that critical.
      this.logger.error(
        `Failed to upload case files overview pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  private async sendEmail(
    to: Recipient | Recipient[],
    subject: string,
    body: string,
    attachments?: Attachment[],
  ) {
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
        to,
        subject,
        text: stripHtmlTags(body),
        html: body,
        attachments,
      })
    } catch (error) {
      this.logger.error('Failed to send email', { error })

      this.eventService.postErrorEvent(
        'Failed to send email',
        {
          subject,
          to: Array.isArray(to)
            ? to.reduce(
                (acc, recipient, index) =>
                  index > 0
                    ? `${acc}, ${recipient.name} (${recipient.address})`
                    : `${recipient.name} (${recipient.address})`,
                '',
              )
            : `${to.name} (${to.address})`,
          attachments:
            attachments && attachments.length > 0
              ? attachments.reduce(
                  (acc, attachment, index) =>
                    index > 0
                      ? `${acc}, ${attachment.filename}`
                      : `${attachment.filename}`,
                  '',
                )
              : undefined,
        },
        error as Error,
      )
    }
  }

  private sendEmailToProsecutor(
    theCase: Case,
    rulingUploadedToS3: boolean,
    rulingAttachment: { filename: string; content: string; encoding: string },
  ) {
    return this.sendEmail(
      {
        name: theCase.prosecutor?.name ?? '',
        address: theCase.prosecutor?.email ?? '',
      },
      this.formatMessage(m.signedRuling.subjectV2, {
        courtCaseNumber: theCase.courtCaseNumber,
        isModifyingRuling: Boolean(theCase.rulingDate),
      }),
      this.formatMessage(m.signedRuling.prosecutorBodyS3V2, {
        courtCaseNumber: theCase.courtCaseNumber,
        courtName: theCase.court?.name?.replace('dómur', 'dómi'),
        linkStart: `<a href="${this.config.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
        linkEnd: '</a>',
        isModifyingRuling: Boolean(theCase.rulingDate),
      }),
      rulingUploadedToS3 ? undefined : [rulingAttachment],
    )
  }

  private sendEmailToCourt(
    theCase: Case,
    rulingUploadedToS3: boolean,
    rulingAttachment: { filename: string; content: string; encoding: string },
  ) {
    const recipients = [
      {
        name: theCase.judge?.name ?? '',
        address: theCase.judge?.email ?? '',
      },
    ]
    if (theCase.registrar) {
      recipients.push({
        name: theCase.registrar?.name ?? '',
        address: theCase.registrar?.email ?? '',
      })
    }

    return this.sendEmail(
      recipients,
      this.formatMessage(m.signedRuling.subjectV2, {
        courtCaseNumber: theCase.courtCaseNumber,
        isModifyingRuling: Boolean(theCase.rulingDate),
      }),
      this.formatMessage(m.signedRuling.courtBody, {
        courtCaseNumber: theCase.courtCaseNumber,
        linkStart: `<a href="${this.config.deepLinks.completedCaseOverviewUrl}${theCase.id}">`,
        linkEnd: '</a>',
      }),
      rulingUploadedToS3 ? undefined : [rulingAttachment],
    )
  }

  private sendEmailToDefender(theCase: Case, rulingUploadedToS3: boolean) {
    return this.sendEmail(
      {
        name: theCase.defenderName ?? '',
        address: theCase.defenderEmail ?? '',
      },
      this.formatMessage(m.signedRuling.subjectV2, {
        courtCaseNumber: theCase.courtCaseNumber,
        isModifyingRuling: Boolean(theCase.rulingDate),
      }),
      this.formatMessage(m.signedRuling.defenderBodyV2, {
        isModifyingRuling: Boolean(theCase.rulingDate),
        courtCaseNumber: theCase.courtCaseNumber,
        courtName: theCase.court?.name?.replace('dómur', 'dómi'),
        defenderHasAccessToRvg: Boolean(theCase.defenderNationalId),
        linkStart: `<a href="${this.config.deepLinks.defenderCaseOverviewUrl}${theCase.id}">`,
        linkEnd: '</a>',
        signedVerdictAvailableInS3: rulingUploadedToS3,
      }),
    )
  }

  private async sendRulingAsSignedPdf(
    theCase: Case,
    user: TUser,
    signedRulingPdf: string,
  ): Promise<void> {
    let rulingUploadedToS3 = false
    let rulingUploadedToCourt = false
    let courtRecordUploadedToCourt = false
    const isModifyingRuling = Boolean(theCase.rulingDate)

    const uploadPromises = [
      this.uploadSignedRulingPdfToS3(theCase, signedRulingPdf).then((res) => {
        rulingUploadedToS3 = res
      }),
    ]

    if (theCase.courtId && theCase.courtCaseNumber) {
      uploadPromises.push(
        this.uploadSignedRulingPdfToCourt(theCase, user, signedRulingPdf).then(
          (res) => {
            rulingUploadedToCourt = res
          },
        ),
      )

      if (!isModifyingRuling) {
        uploadPromises.push(
          this.uploadCaseFilesPdfToCourt(theCase, user),
          getCourtRecordPdfAsString(theCase, this.formatMessage)
            .then(async (courtRecordPdf) => {
              return this.uploadCourtRecordPdfToCourt(
                theCase,
                user,
                courtRecordPdf,
              ).then((res) => {
                courtRecordUploadedToCourt = res
              })
            })
            .catch((reason) => {
              // Log and ignore this error. The court record can be uploaded manually.
              this.logger.error(
                `Failed to generate court record pdf for case ${theCase.id}`,
                { reason },
              )
            }),
        )
      }
    }

    await Promise.all(uploadPromises)

    const rulingAttachment = {
      filename: this.formatMessage(m.signedRuling.rulingAttachment, {
        courtCaseNumber: theCase.courtCaseNumber,
      }),
      content: signedRulingPdf,
      encoding: 'binary',
    }

    const emailPromises = [
      this.sendEmailToProsecutor(theCase, rulingUploadedToS3, rulingAttachment),
    ]

    if (
      !rulingUploadedToCourt ||
      (!isModifyingRuling && !courtRecordUploadedToCourt)
    ) {
      emailPromises.push(
        this.sendEmailToCourt(theCase, rulingUploadedToS3, rulingAttachment),
      )
    }

    if (
      theCase.defenderEmail &&
      (isRestrictionCase(theCase.type) ||
        theCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
        theCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON)
    ) {
      emailPromises.push(this.sendEmailToDefender(theCase, rulingUploadedToS3))
    }

    await Promise.all(emailPromises)
  }

  private async createCase(
    caseToCreate: CreateCaseDto,
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create(caseToCreate, { transaction })
      : this.caseModel.create(caseToCreate))

    return theCase.id
  }

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      include: includes,
      order: [defendantsOrder],
      where: {
        id: caseId,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async findOriginalAncestor(theCase: Case): Promise<Case> {
    let originalAncestor: Case = theCase

    while (originalAncestor.parentCaseId) {
      const parentCase = await this.caseModel.findOne({
        where: { id: originalAncestor.parentCaseId },
      })

      if (!parentCase) {
        throw new InternalServerErrorException(
          `Original ancestor of case ${theCase.id} not found`,
        )
      }

      originalAncestor = parentCase
    }

    return originalAncestor
  }

  async getAll(user: TUser): Promise<Case[]> {
    return this.caseModel.findAll({
      include: includes,
      order: [defendantsOrder],
      where: getCasesQueryFilter(user),
    })
  }

  async internalCreate(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined
    let courtId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${prosecutor.id} is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
      courtId = prosecutor.institution?.defaultCourtId
    }

    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.LOKE,
            creatingProsecutorId: prosecutorId,
            prosecutorId,
            courtId,
          } as InternalCreateCaseDto,
          transaction,
        )

        await this.defendantService.create(
          caseId,
          {
            nationalId: caseToCreate.accusedNationalId,
            name: caseToCreate.accusedName,
            gender: caseToCreate.accusedGender,
            address: caseToCreate.accusedAddress,
          },
          transaction,
        )

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async create(caseToCreate: CreateCaseDto, prosecutor: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            ...caseToCreate,
            origin: CaseOrigin.RVG,
            creatingProsecutorId: prosecutor.id,
            prosecutorId: prosecutor.id,
            courtId: prosecutor.institution?.defaultCourtId,
          } as CreateCaseDto,
          transaction,
        )

        await this.defendantService.create(caseId, {}, transaction)

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async update(
    caseId: string,
    update: UpdateCaseDto,
    returnUpdatedCase = true,
    transaction?: Transaction,
  ): Promise<Case | undefined> {
    const promisedUpdate = transaction
      ? this.caseModel.update(update, {
          where: { id: caseId },
          transaction,
        })
      : this.caseModel.update(update, {
          where: { id: caseId },
        })

    const [numberOfAffectedRows] = await promisedUpdate

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(`Could not update case ${caseId}`)
    }

    if (returnUpdatedCase) {
      return this.findById(caseId)
    }
  }

  async getRequestPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getRequestPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCourtRecordPdf(theCase: Case, user: TUser): Promise<Buffer> {
    try {
      return await this.awsS3Service.getObject(
        `generated/${theCase.id}/courtRecord.pdf`,
      )
    } catch (error) {
      this.logger.info(
        `The court record for case ${theCase.id} was not found in AWS S3`,
        { error },
      )
    }

    await this.refreshFormatMessage()

    return getCourtRecordPdfAsBuffer(theCase, user, this.formatMessage)
  }

  async getRulingPdf(theCase: Case, useSigned: boolean): Promise<Buffer> {
    if (useSigned) {
      try {
        return await this.awsS3Service.getObject(
          `generated/${theCase.id}/ruling.pdf`,
        )
      } catch (error) {
        this.logger.info(
          `The ruling for case ${theCase.id} was not found in AWS S3`,
          { error },
        )
      }
    }

    await this.refreshFormatMessage()

    return getRulingPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCustodyPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  async requestCourtRecordSignature(
    theCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    // Development without signing service access token
    if (!this.config.production && !this.config.dokobitAccessToken) {
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    await this.refreshFormatMessage()

    const pdf = await getCourtRecordPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        user.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        user.name ?? '',
        'Ísland',
        'courtRecord.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a court record signature',
          {
            caseId: theCase.id,
            policeCaseNumber: theCase.policeCaseNumber,
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getCourtRecordSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestCourtRecordSignature

    // Production, or development with signing service access token
    if (this.config.production || this.config.dokobitAccessToken) {
      try {
        const courtRecordPdf = await this.signingService.waitForSignature(
          'courtRecord.pdf',
          documentToken,
        )

        this.awsS3Service
          .putObject(`generated/${theCase.id}/courtRecord.pdf`, courtRecordPdf)
          .catch((reason) => {
            // Tolerate failure, but log error
            this.logger.error(
              `Failed to upload signed court record pdf to AWS S3 for case ${theCase.id}`,
              { reason },
            )
          })
      } catch (error) {
        this.eventService.postErrorEvent(
          'Failed to get a court record signature confirmation',
          {
            caseId: theCase.id,
            policeCaseNumber: theCase.policeCaseNumber,
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error as Error,
        )

        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain courtRecordSignatoryId and courtRecordSignatureDate - create a new type for CaseService.update
    await this.update(
      theCase.id,
      {
        courtRecordSignatoryId: user.id,
        courtRecordSignatureDate: nowFactory(),
      } as UpdateCaseDto,
      false,
    )

    return { documentSigned: true }
  }

  async requestRulingSignature(theCase: Case): Promise<SigningServiceResponse> {
    // Development without signing service access token
    if (!this.config.production && !this.config.dokobitAccessToken) {
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    await this.refreshFormatMessage()

    const pdf = await getRulingPdfAsString(theCase, this.formatMessage)

    return this.signingService
      .requestSignature(
        theCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        theCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
      .catch((error) => {
        this.eventService.postErrorEvent(
          'Failed to request a ruling signature',
          {
            caseId: theCase.id,
            policeCaseNumber: theCase.policeCaseNumber,
            courtCaseNumber: theCase.courtCaseNumber,
            actor: theCase.judge?.name,
            institution: theCase.judge?.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature

    // Production, or development with signing service access token
    if (this.config.production || this.config.dokobitAccessToken) {
      try {
        const signedPdf = await this.signingService.waitForSignature(
          'ruling.pdf',
          documentToken,
        )

        await this.refreshFormatMessage()

        await this.sendRulingAsSignedPdf(theCase, user, signedPdf)
      } catch (error) {
        this.eventService.postErrorEvent(
          'Failed to get a ruling signature confirmation',
          {
            caseId: theCase.id,
            policeCaseNumber: theCase.policeCaseNumber,
            courtCaseNumber: theCase.courtCaseNumber,
            actor: user.name,
            institution: user.institution?.name,
          },
          error as Error,
        )

        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
    const newRulingDate = nowFactory()
    await this.update(
      theCase.id,
      {
        rulingDate: newRulingDate,
        ...(!theCase.rulingDate
          ? {}
          : {
              rulingModifiedHistory: formatRulingModifiedHistory(
                theCase.rulingModifiedHistory,
                newRulingDate,
                theCase.judge?.name,
                theCase.judge?.title,
              ),
            }),
      } as UpdateCaseDto,
      false,
    )

    return {
      documentSigned: true,
    }
  }

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumber: theCase.policeCaseNumber,
            defenderName: theCase.defenderName,
            defenderNationalId: theCase.defenderNationalId,
            defenderEmail: theCase.defenderEmail,
            defenderPhoneNumber: theCase.defenderPhoneNumber,
            leadInvestigator: theCase.leadInvestigator,
            courtId: theCase.courtId,
            translator: theCase.translator,
            lawsBroken: theCase.lawsBroken,
            legalBasis: theCase.legalBasis,
            legalProvisions: theCase.legalProvisions,
            requestedCustodyRestrictions: theCase.requestedCustodyRestrictions,
            caseFacts: theCase.caseFacts,
            legalArguments: theCase.legalArguments,
            requestProsecutorOnlySession: theCase.requestProsecutorOnlySession,
            prosecutorOnlySessionRequest: theCase.prosecutorOnlySessionRequest,
            parentCaseId: theCase.id,
            initialRulingDate: theCase.initialRulingDate ?? theCase.rulingDate,
            creatingProsecutorId: user.id,
            prosecutorId: user.id,
          } as CreateCaseDto,
          transaction,
        )

        if (theCase.defendants && theCase.defendants?.length > 0) {
          await Promise.all(
            theCase.defendants?.map((defendant) =>
              this.defendantService.create(
                caseId,
                {
                  noNationalId: defendant.noNationalId,
                  nationalId: defendant.nationalId,
                  name: defendant.name,
                  gender: defendant.gender,
                  address: defendant.address,
                  citizenship: defendant.citizenship,
                },
                transaction,
              ),
            ),
          )
        }

        return caseId
      })
      .then((caseId) => this.findById(caseId))
  }

  async uploadRequestPdfToCourt(theCase: Case, user: TUser): Promise<void> {
    try {
      await this.refreshFormatMessage()

      const pdf = await getRequestPdfAsBuffer(theCase, this.formatMessage)

      await this.courtService.createRequest(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        `Krafa ${theCase.policeCaseNumber}`,
        pdf,
      )
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to upload request pdf to court for case ${theCase.id}`,
        { error },
      )
    }
  }

  async createCourtCase(theCase: Case, user: TUser): Promise<Case> {
    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId ?? '',
      theCase.type,
      theCase.policeCaseNumber,
      Boolean(theCase.parentCaseId),
    )

    const updatedCase = (await this.update(
      theCase.id,
      { courtCaseNumber },
      true,
    )) as Case

    // No need to wait
    this.uploadRequestPdfToCourt(updatedCase, user)

    return updatedCase
  }

  async archive(): Promise<ArchiveResponse> {
    const theCase = await this.caseModel.findOne({
      include: [...includes, { model: CaseFile, as: 'caseFiles' }],
      order: [
        defendantsOrder,
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

      await this.update(
        theCase.id,
        { ...clearedCaseProperties, isArchived: true } as UpdateCaseDto,
        false,
        transaction,
      )
    })

    this.eventService.postEvent(CaseEvent.ARCHIVE, theCase)

    return { caseArchived: true }
  }
}
