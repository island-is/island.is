import { Op } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { CaseState, User as TUser } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { generateRulingPdf, writeFile } from '../../formatters'
import { User } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, SignatureConfirmationResponse } from './models'

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

  private async sendEmail(
    recipientName: string,
    recipientEmail: string,
    courtCaseNumber: string,
    signedRulingPdf: string,
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
        text: 'Sjá viðhengi',
        html: 'Sjá viðhengi',
        attachments: [
          {
            filename: `${courtCaseNumber}.pdf`,
            content: signedRulingPdf,
            encoding: 'binary',
          },
        ],
      })
    } catch (error) {
      this.logger.error(`Failed to send email to ${recipientEmail}`, error)
    }
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    user: TUser,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    await Promise.all([
      this.sendEmail(
        existingCase.prosecutor?.name,
        existingCase.prosecutor?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        existingCase.judge?.name || user?.name,
        existingCase.judge?.email || user?.email,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
      this.sendEmail(
        existingCase.defenderName,
        existingCase.defenderEmail,
        existingCase.courtCaseNumber,
        signedRulingPdf,
      ),
    ])
  }

  private sevenDaysFromNow(): string {
    const now = new Date()
    const sevenDaysFromNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )

    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() - 7)

    return sevenDaysFromNow.toISOString()
  }

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    const sevenDaysFromNow = this.sevenDaysFromNow()

    return this.caseModel.findAll({
      order: [['created', 'DESC']],
      where: {
        [Op.or]: [
          {
            state: {
              [Op.in]: [
                CaseState.NEW,
                CaseState.DRAFT,
                CaseState.SUBMITTED,
                CaseState.RECEIVED,
              ],
            },
          },
          {
            [Op.and]: [
              { state: CaseState.ACCEPTED },
              { custodyEndDate: { [Op.gt]: sevenDaysFromNow } },
            ],
          },
          {
            [Op.and]: [
              { state: CaseState.REJECTED },
              { courtEndTime: { [Op.gt]: sevenDaysFromNow } },
            ],
          },
        ],
      },
      include: [
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

  getRulingPdf(existingCase: Case, user: TUser): Promise<string> {
    this.logger.debug(
      `Getting the ruling for case ${existingCase.id} as a pdf document`,
    )

    return generateRulingPdf(existingCase, user)
  }

  async requestSignature(
    existingCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    const pdf = await generateRulingPdf(existingCase, user)

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      return this.signingService.requestSignature(
        user.mobileNumber,
        'Undirrita dóm - Öryggistala',
        user.name,
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
    user: TUser,
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

        await this.sendRulingAsSignedPdf(existingCase, user, signedPdf)
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
