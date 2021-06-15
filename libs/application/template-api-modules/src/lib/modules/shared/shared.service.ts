import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmailService } from '@island.is/email-service'
import { Application } from '@island.is/application/core'
import {
  BaseTemplateAPIModuleConfig,
  EmailTemplateGenerator,
  AssignmentEmailTemplateGenerator,
  AttachmentEmailTemplateGenerator,
} from '../../types'
import { createAssignToken, getConfigValue } from './shared.utils'
import { ChargeResult } from '@island.is/api/domains/payment'
import { PaymentService, BaseCharge } from '@island.is/clients/payment'

@Injectable()
export class SharedTemplateApiService {
  constructor(
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async sendEmail(
    templateGenerator: EmailTemplateGenerator,
    application: Application,
    locale = 'is',
  ) {
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    const email = getConfigValue(
      this.configService,
      'email',
    ) as BaseTemplateAPIModuleConfig['email']

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
    locale = 'is',
  ) {
    const token = createAssignToken(
      application,
      getConfigValue(this.configService, 'jwtSecret'),
    )

    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    const email = getConfigValue(
      this.configService,
      'email',
    ) as BaseTemplateAPIModuleConfig['email']

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
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    const email = getConfigValue(
      this.configService,
      'email',
    ) as BaseTemplateAPIModuleConfig['email']

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

  async createCharge(
    charge: BaseCharge,
    applicationId: string,
  ): Promise<ChargeResult> {
    return this.paymentService.createPayment(charge, applicationId)
  }

  async makeGraphqlQuery(
    authorization: string,
    query: string,
    variables?: Record<string, any>,
  ) {
    const baseApiUrl = getConfigValue(
      this.configService,
      'baseApiUrl',
    ) as string

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
}
