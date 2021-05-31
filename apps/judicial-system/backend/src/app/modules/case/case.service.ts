import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import {
  IntegratedCourts,
  User as TUser,
} from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  getRequestPdfAsBuffer,
  getRequestPdfAsString,
  getRulingPdfAsString,
  writeFile,
} from '../../formatters'
import { Institution } from '../institution'
import { User } from '../user'
import { CourtService } from '../court'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { getCasesQueryFilter, isCaseBlockedFromUser } from './filters'
import { Case, SignatureConfirmationResponse } from './models'

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async uploadSignedRulingPdfToCourt(
    existingCase: Case,
    pdf: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Uploading signed ruling pdf to court for case ${existingCase.id}`,
    )

    const buffer = Buffer.from(pdf, 'binary')

    try {
      const streamId = await this.courtService.uploadStream(buffer)
      await this.courtService.createThingbok(
        existingCase.courtCaseNumber,
        streamId,
      )

      return true
    } catch (error) {
      this.logger.error('Failed to upload request to court', error)

      return false
    }
  }

  private async sendEmail(
    recipientName: string,
    recipientEmail: string,
    courtCaseNumber: string,
    signedRulingPdf: string,
    body: string,
  ) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        replyTo: {
          name: environment.email.replyToName,
          address: environment.email.replyToEmail,
        },
        to: [
          {
            name: recipientName,
            address: recipientEmail,
          },
        ],
        subject: `Úrskurður í máli ${courtCaseNumber}`,
        text: body,
        html: body,
        attachments: [
          {
            filename: `Þingbók og úrskurður ${courtCaseNumber}.pdf`,
            content: signedRulingPdf,
            encoding: 'binary',
          },
        ],
      })
    } catch (error) {
      this.logger.error('Failed to send email', error)
    }
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    const uploaded = IntegratedCourts.includes(existingCase.courtId)
      ? await this.uploadSignedRulingPdfToCourt(existingCase, signedRulingPdf)
      : false

    await Promise.all([
      this.sendEmail(
        existingCase.prosecutor?.name,
        existingCase.prosecutor?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
        'Sjá viðhengi',
      ),
      this.sendEmail(
        existingCase.registrar?.name,
        existingCase.registrar?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
        uploaded
          ? `Meðfylgjandi skjal hefur einnig verið vistað undir möppunni Þingbækur í máli ${existingCase.courtCaseNumber} í Auði.`
          : 'Ekki tókst að vista meðfylgjandi skjal í Auði.',
      ),
      this.sendEmail(
        existingCase.judge?.name,
        existingCase.judge?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
        'Sjá viðhengi',
      ),
      this.sendEmail(
        existingCase.defenderName,
        existingCase.defenderEmail,
        existingCase.courtCaseNumber,
        signedRulingPdf,
        'Sjá viðhengi',
      ),
      this.sendEmail(
        'Fangelsismálastofnun',
        environment.notifications.prisonAdminEmail,
        existingCase.courtCaseNumber,
        signedRulingPdf,
        'Sjá viðhengi',
      ),
    ])
  }

  private findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case ${id}`)

    return this.caseModel.findOne({
      where: { id },
      include: [
        {
          model: Institution,
          as: 'court',
        },
        {
          model: User,
          as: 'prosecutor',
          include: [{ model: Institution, as: 'institution' }],
        },
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
        { model: Case, as: 'parentCase' },
        { model: Case, as: 'childCase' },
      ],
    })
  }

  getAll(user: TUser): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['created', 'DESC']],
      where: getCasesQueryFilter(user),
      include: [
        {
          model: Institution,
          as: 'court',
        },
        {
          model: User,
          as: 'prosecutor',
          include: [{ model: Institution, as: 'institution' }],
        },
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
        { model: Case, as: 'parentCase' },
        { model: Case, as: 'childCase' },
      ],
    })
  }

  async findByIdAndUser(id: string, user: TUser): Promise<Case> {
    const existingCase = await this.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    if (isCaseBlockedFromUser(existingCase, user)) {
      throw new ForbiddenException(
        `User ${user.id} does not have access to case ${id}`,
      )
    }

    return existingCase
  }

  create(caseToCreate: CreateCaseDto, user?: TUser): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create({
      ...caseToCreate,
      prosecutorId: user?.id,
    })
  }

  async update(
    id: string,
    update: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case ${id}`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  getRulingPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the ruling for case ${existingCase.id} as a pdf document`,
    )

    return getRulingPdfAsString(existingCase)
  }

  getRequestPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the request for case ${existingCase.id} as a pdf document`,
    )

    return getRequestPdfAsString(existingCase)
  }

  async requestSignature(existingCase: Case): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    const pdf = await getRulingPdfAsString(existingCase)

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      return this.signingService.requestSignature(
        existingCase.judge?.mobileNumber,
        'Undirrita skjal - Öryggistala',
        existingCase.judge?.name,
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async getSignatureConfirmation(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should be called immediately after requestSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(existingCase, signedPdf)
      } catch (error) {
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
    await this.update(existingCase.id, {
      rulingDate: new Date(),
    } as UpdateCaseDto)

    return {
      documentSigned: true,
    }
  }

  extend(existingCase: Case): Promise<Case> {
    this.logger.debug(`Extending case ${existingCase.id}`)

    return this.caseModel.create({
      type: existingCase.type,
      policeCaseNumber: existingCase.policeCaseNumber,
      accusedNationalId: existingCase.accusedNationalId,
      accusedName: existingCase.accusedName,
      accusedAddress: existingCase.accusedAddress,
      accusedGender: existingCase.accusedGender,
      courtId: existingCase.courtId,
      lawsBroken: existingCase.lawsBroken,
      custodyProvisions: existingCase.custodyProvisions,
      requestedCustodyRestrictions: existingCase.requestedCustodyRestrictions,
      caseFacts: existingCase.caseFacts,
      legalArguments: existingCase.legalArguments,
      parentCaseId: existingCase.id,
    })
  }

  async uploadRequestPdfToCourt(id: string): Promise<void> {
    this.logger.debug(`Uploading request pdf to court for case ${id}`)

    const existingCase = await this.findById(id)

    const pdf = await getRequestPdfAsBuffer(existingCase)

    try {
      const streamId = await this.courtService.uploadStream(pdf)
      await this.courtService.createDocument(
        existingCase.courtCaseNumber,
        streamId,
      )
    } catch (error) {
      this.logger.error('Failed to upload request to court', error)
    }
  }
}
