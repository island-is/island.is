import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'

import { environment } from '../../../environments'
import { User } from '../user'
import { Notification } from '../notification/notification.model'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, SignatureResponse } from './models'
import { generateRulingPdf, writeFile } from './pdf'
import { TransitionUpdate } from './case.state'

@Injectable()
export class CaseService {
  constructor(
    @Inject(SigningService)
    private readonly signingService: SigningService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

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
          name: existingCase.prosecutor?.name,
          address: existingCase.prosecutor?.email,
        },
        {
          name: existingCase.judge?.name,
          address: existingCase.judge?.email,
        },
      ],
      subject: `Úrskurður í máli ${existingCase.courtCaseNumber}`,
      text: 'Sjá viðhengi',
      html: 'Sjá viðhengi',
      attachments: [
        {
          filename: `${existingCase.courtCaseNumber}.pdf`,
          content: signedRulingPdf,
          encoding: 'binary',
        },
      ],
    })
  }

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['modified', 'DESC']],
      include: [
        Notification,
        { model: User, as: 'prosecutor' },
        { model: User, as: 'judge' },
      ],
    })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case ${id}`)

    return this.caseModel.findOne({
      where: { id },
      include: [
        Notification,
        { model: User, as: 'prosecutor' },
        { model: User, as: 'judge' },
      ],
    })
  }

  create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create(caseToCreate)
  }

  async update(
    id: string,
    update: UpdateCaseDto | TransitionUpdate,
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

  async requestSignature(existingCase: Case): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED

    const pdf = await generateRulingPdf(existingCase)

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      return this.signingService.requestSignature(
        existingCase.judge.mobileNumber,
        'Undirrita dóm - Öryggistala',
        existingCase.judge.name,
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

  async confirmSignature(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED and
    // requestSignature has previously been called for the same case

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

    return {
      documentSigned: true,
    }
  }
}
