import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { EmailService } from '@island.is/email-service'
import {
  Application,
  BasicChargeItem,
  GraphqlGatewayResponse,
} from '@island.is/application/types'
import {
  AssignmentEmailTemplateGenerator,
  AssignmentSmsTemplateGenerator,
  AttachmentEmailTemplateGenerator,
  EmailTemplateGenerator,
  SmsTemplateGenerator,
} from '../../types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { PaymentService } from '@island.is/application/api/payment'
import { User } from '@island.is/auth-nest-tools'
import { ExtraData } from '@island.is/clients/charge-fjs-v2'
import { sharedModuleConfig } from './shared.config'
import { ApplicationService } from '@island.is/application/api/core'
import jwt from 'jsonwebtoken'
import { uuid } from 'uuidv4'

@Injectable()
export class SharedTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(SmsService)
    private readonly smsService: SmsService,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly applicationService: ApplicationService,
    private readonly paymentService: PaymentService,
  ) {}

  async createAssignToken(application: Application, expiresIn: number) {
    const token = await this.createToken(
      application,
      this.config.templateApi.jwtSecret,
      expiresIn,
    )

    return token
  }

  async sendSms(
    smsTemplateGenerator: SmsTemplateGenerator,
    application: Application,
  ): Promise<any> {
    const clientLocationOrigin = this.config.templateApi.clientLocationOrigin

    const { phoneNumber, message } = smsTemplateGenerator(application, {
      clientLocationOrigin,
    })

    const normalizedPhoneNumber = this.normalizePhoneNumber(
      phoneNumber,
      application.id,
    )

    return this.smsService.sendSms(normalizedPhoneNumber, message)
  }

  async assignApplicationThroughSms(
    smsTemplateGenerator: AssignmentSmsTemplateGenerator,
    application: Application,
    token: string,
  ): Promise<any> {
    const clientLocationOrigin = this.config.templateApi.clientLocationOrigin

    const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

    const { phoneNumber, message } = smsTemplateGenerator(
      application,
      assignLink,
    )

    const normalizedPhoneNumber = this.normalizePhoneNumber(
      phoneNumber,
      application.id,
    )

    return this.smsService.sendSms(normalizedPhoneNumber, message)
  }

  normalizePhoneNumber(phoneNumber: string, applicationId: string) {
    if (phoneNumber.trim().length > 7) {
      this.logger.warn(
        `Recipient number for application ${applicationId} is longer than 7 characters, attempting to recover`,
      )
    }
    if (phoneNumber.match(/\D/g)) {
      this.logger.warn(
        `Recipient number for application ${applicationId} contains non-numeric characters, attempting to recover`,
      )
    }
    return phoneNumber.trim().replace(/\D/g, '').slice(-7)
  }

  async sendEmail(
    templateGenerator: EmailTemplateGenerator,
    application: Application,
    locale = 'is',
  ) {
    const clientLocationOrigin = this.config.templateApi.clientLocationOrigin

    const email = this.config.templateApi.email

    const template = templateGenerator({
      application,
      options: {
        clientLocationOrigin,
        locale,
        email,
      },
    })

    return this.emailService.sendEmail(template)
  }

  async assignApplicationThroughEmail(
    templateGenerator: AssignmentEmailTemplateGenerator,
    application: Application,
    token: string,
    locale = 'is',
  ) {
    const clientLocationOrigin = this.config.templateApi.clientLocationOrigin
    const email = this.config.templateApi.email

    const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

    const template = templateGenerator(
      {
        application,
        options: {
          clientLocationOrigin,
          locale,
          email,
        },
      },
      assignLink,
    )

    return this.emailService.sendEmail(template)
  }

  async sendEmailWithAttachment(
    templateGenerator: AttachmentEmailTemplateGenerator,
    application: Application,
    fileContent: string,
    recipientEmail: string,
    locale = 'is',
  ) {
    const clientLocationOrigin = this.config.templateApi.clientLocationOrigin
    const email = this.config.templateApi.email

    const template = templateGenerator(
      {
        application,
        options: {
          clientLocationOrigin,
          locale,
          email,
        },
      },
      fileContent,
      recipientEmail,
    )

    return this.emailService.sendEmail(template)
  }

  async makeGraphqlQuery<T = unknown>(
    authorization: string,
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<GraphqlGatewayResponse<T>> {
    const baseApiUrl = this.config.baseApiUrl

    return fetch(`${baseApiUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization,
      },
      body: JSON.stringify({ query, variables }),
    })
  }

  // Note: this is an old function that only 2 applications use: PassportService and DrivingLicenseSubmissionService
  async createCharge(
    user: User,
    applicationId: string,
    performingOrganizationID: string,
    chargeItems: BasicChargeItem[],
    extraData: ExtraData[] | undefined = undefined,
    currentUserLocale: string | undefined = undefined,
  ) {
    return this.paymentService.createCharge(
      user,
      performingOrganizationID,
      chargeItems,
      applicationId,
      extraData,
      currentUserLocale,
    )
  }

  async getPaymentStatus(applicationId: string) {
    return this.paymentService.getStatus(applicationId)
  }

  async refundPayment(applicationId: string, reasonForRefund?: string) {
    return this.paymentService.refundPayment(applicationId, reasonForRefund)
  }

  async storeNonceForApplication(application: Application): Promise<string> {
    const nonce = uuid()

    const applicationToUpdate = await this.applicationService.findOneById(
      application.id,
    )

    if (!applicationToUpdate) throw new Error('Application not found')

    await this.applicationService.addNonce(applicationToUpdate, nonce)

    return nonce
  }

  async createToken(
    application: Application,
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    const nonce = await this.storeNonceForApplication(application)
    const token = jwt.sign(
      {
        applicationId: application.id,
        state: application.state,
        nonce,
      },
      secret,
      { expiresIn },
    )
    return token
  }
}
