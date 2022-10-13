import { Op } from 'sequelize'
import { Includeable, OrderItem, Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'
import { Attachment } from 'nodemailer/lib/mailer'
import { PDFDocument, PDFName, PDFRef, StandardFonts } from 'pdf-lib'

import {
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
import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { EmailService } from '@island.is/email-service'
import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'
import { caseTypes } from '@island.is/judicial-system/formatters'

import { nowFactory } from '../../factories'
import {
  getRequestPdfAsBuffer,
  getRulingPdfAsString,
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
import { User } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { EventService } from '../event'
import { PoliceService } from '../police'
import { CreateCaseDto } from './dto/createCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { getCasesQueryFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { DeliverResponse } from './models/deliver.response'
import { DeliverProsecutorDocumentsResponse } from './models/deliverProsecutorDocuments.response'
import { caseModuleConfig } from './case.config'

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
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    where: {
      state: { [Op.not]: CaseFileState.DELETED },
    },
  },
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
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly defendantService: DefendantService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    private readonly eventService: EventService,
    private readonly policeService: PoliceService,
    private readonly messageService: MessageService,
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
    buffer: Buffer,
    user?: TUser,
  ): Promise<boolean> {
    if (!this.config.production) {
      writeFile(`${theCase.id}-ruling-signed.pdf`, buffer)
    }

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

      if (!this.config.production) {
        writeFile(`${theCase.id}-court-record.pdf`, pdf)
      }

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
    return this.getRequestPdf(theCase)
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

  private async sendEmailToCourt(
    theCase: Case,
    subject: string,
    body: string,
    attachment?: Attachment,
  ) {
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
        attachments: attachment ? [attachment] : [],
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
          attachments: attachment && `${attachment.filename}`,
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

  private async deliverSignedRulingToCourt(theCase: Case): Promise<boolean> {
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
          theCase.type,
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

  async createCase(
    caseToCreate: CreateCaseDto,
    transaction?: Transaction,
  ): Promise<string> {
    const theCase = await (transaction
      ? this.caseModel.create({ ...caseToCreate }, { transaction })
      : this.caseModel.create({ ...caseToCreate }))

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

  async getAll(user: TUser): Promise<Case[]> {
    return this.caseModel.findAll({
      include: includes,
      order: [defendantsOrder],
      where: getCasesQueryFilter(user),
    })
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

    return getCourtRecordPdfAsBuffer(theCase, this.formatMessage, user)
  }

  async getCaseFilesPdf(theCase: Case): Promise<Buffer> {
    const PAGE_WIDTH = 500
    const PAGE_HEIGHT = 750

    const createPageLinkAnnotation = (pdfDoc: PDFDocument, pageRef: PDFRef) =>
      pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: 'Annot',
          Subtype: 'Link',
          /* Bounds of the link on the page */
          Rect: [
            145, // lower left x coord
            PAGE_HEIGHT - 200 - 10, // lower left y coord
            358, // upper right x coord
            PAGE_HEIGHT - 200 + 25, // upper right y coord
          ],
          /* Give the link a 2-unit-wide border, with sharp corners */
          Border: [0, 0, 2],
          /* Make the border color blue: rgb(0, 0, 1) */
          C: [0, 0, 1],
          /* Page to be visited when the link is clicked */
          Dest: [pageRef, 'XYZ', null, null, null],
        }),
      )

    const pdfDoc = await PDFDocument.create()
    let pageNumber = 0
    const pageNumberFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    const files =
      theCase.caseFiles?.filter(
        (file) =>
          file.category === CaseFileCategory.CASE_FILE &&
          file.type === 'application/pdf' &&
          file.key,
      ) ?? []
    for (let i = 0; i < files.length; i++) {
      await this.awsS3Service
        .getObject(files[i].key ?? '')
        .then(async (next) => {
          const nextPdf = await PDFDocument.load(next)
          const pages = await pdfDoc.copyPages(
            nextPdf,
            nextPdf.getPageIndices(),
          )
          for (let j = 0; j < pages.length; j++) {
            const page = pages[j]
            if (i === 0 && j === 0) {
              const link1 = createPageLinkAnnotation(pdfDoc, page.ref)
              coverPage.node.set(
                PDFName.of('Annots'),
                pdfDoc.context.obj([link1]),
              )
            }
            const pageNumberText = `${++pageNumber}`
            const pageNumberTextWidth = pageNumberFont.widthOfTextAtSize(
              pageNumberText,
              20,
            )
            page.drawText(pageNumberText, {
              x: page.getWidth() - 10 - pageNumberTextWidth,
              y: 10,
              size: 20,
              font: pageNumberFont,
            })
            pdfDoc.addPage(page)
          }
        })
        .catch((err) => {
          this.logger.error(
            `Could not get file ${files[i].id} of case ${theCase.id} from AWS S3`,
            { err },
          )
        })
    }
    coverPage.drawText('Skjalaskrá', { size: 50, x: 175, y: PAGE_HEIGHT - 100 })
    coverPage.drawText('Skjal 1', {
      size: 24,
      x: 175,
      y: PAGE_HEIGHT - 200,
    })

    const pdf = await pdfDoc.save()

    return Buffer.from(pdf)
  }

  async getRulingPdf(theCase: Case, useSigned = true): Promise<Buffer> {
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
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
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
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
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
            policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
            courtCaseNumber: theCase.courtCaseNumber,
            actor: theCase.judge?.name,
            institution: theCase.judge?.institution?.name,
          },
          error,
        )

        throw error
      })
  }

  addCaseCompletedMessageToQueue(caseId: string): Promise<string> {
    return this.messageService.postMessageToQueue({
      type: MessageType.CASE_COMPLETED,
      caseId,
    })
  }

  addCaseConnectedToCourtCaseMessageToQueue(caseId: string): Promise<string> {
    return this.messageService.postMessageToQueue({
      type: MessageType.CASE_CONNECTED_TO_COURT_CASE,
      caseId,
    })
  }

  async getRulingSignatureConfirmation(
    theCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    // This method should be called immediately after requestRulingSignature
    try {
      const signedPdf = await this.signingService.waitForSignature(
        'ruling.pdf',
        documentToken,
      )
      const awsSuccess = await this.uploadSignedRulingPdfToS3(
        theCase,
        signedPdf,
      )

      if (!awsSuccess) {
        return { documentSigned: false, message: 'Failed to upload to S3' }
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

      // No need to wait for now, but may consider including this in a transaction with the database update later
      this.addCaseCompletedMessageToQueue(theCase.id)

      return { documentSigned: true }
    } catch (error) {
      this.eventService.postErrorEvent(
        'Failed to get a ruling signature confirmation',
        {
          caseId: theCase.id,
          policeCaseNumbers: theCase.policeCaseNumbers.join(', '),
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

  async extend(theCase: Case, user: TUser): Promise<Case> {
    return this.sequelize
      .transaction(async (transaction) => {
        const caseId = await this.createCase(
          {
            origin: theCase.origin,
            type: theCase.type,
            description: theCase.description,
            policeCaseNumbers: theCase.policeCaseNumbers,
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

  async createCourtCase(theCase: Case, user: TUser): Promise<Case> {
    const courtCaseNumber = await this.courtService.createCourtCase(
      user,
      theCase.id,
      theCase.courtId,
      theCase.type,
      theCase.policeCaseNumbers,
      Boolean(theCase.parentCaseId),
    )

    const updatedCase = (await this.update(
      theCase.id,
      { courtCaseNumber },
      true,
    )) as Case

    // No need to wait for now, but may consider including this in a transaction with the database update later
    this.addCaseConnectedToCourtCaseMessageToQueue(updatedCase.id)

    return updatedCase
  }

  async deliver(theCase: Case): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    const rulingDeliveredToCourt =
      isIndictmentCase(theCase.type) ||
      (await this.deliverSignedRulingToCourt(theCase))

    const courtRecordDeliveredToCourt =
      isIndictmentCase(theCase.type) ||
      Boolean(theCase.rulingModifiedHistory) || // court record did not change
      (await this.uploadCourtRecordPdfToCourt(theCase))

    const caseFilesDeliveredToCourt =
      isIndictmentCase(theCase.type) ||
      Boolean(theCase.rulingModifiedHistory) || // case files did not change
      (await this.deliverCaseFilesToCourt(theCase))

    const caseDeliveredToPolice =
      theCase.origin === CaseOrigin.LOKE &&
      (Boolean(theCase.rulingModifiedHistory) || // no relevant changes
        (await this.deliverCaseToPolice(theCase)))

    if (
      !isIndictmentCase(theCase.type) &&
      (!rulingDeliveredToCourt || !courtRecordDeliveredToCourt)
    ) {
      this.sendEmailToCourt(
        theCase,
        this.formatMessage(m.signedRuling.subjectV2, {
          courtCaseNumber: theCase.courtCaseNumber,
          isModifyingRuling: Boolean(theCase.rulingModifiedHistory),
        }),
        this.formatMessage(m.signedRuling.courtBody, {
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        }),
      )
    }

    return {
      rulingDeliveredToCourt,
      courtRecordDeliveredToCourt,
      caseFilesDeliveredToCourt,
      caseDeliveredToPolice,
    }
  }

  async deliverProsecutorDocuments(
    theCase: Case,
  ): Promise<DeliverProsecutorDocumentsResponse> {
    const requestDeliveredToCourt = await this.deliverProsecutorDocumentsToCourt(
      theCase,
    )

    return {
      requestDeliveredToCourt,
    }
  }
}
