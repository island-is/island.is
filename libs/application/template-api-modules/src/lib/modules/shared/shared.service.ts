import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmailService } from '@island.is/email-service'
import {
  Application,
  GraphqlGatewayResponse,
} from '@island.is/application/core'
import {
  BaseTemplateAPIModuleConfig,
  EmailTemplateGenerator,
  AssignmentEmailTemplateGenerator,
  AttachmentEmailTemplateGenerator,
} from '../../types'
import { createAssignToken, getConfigValue } from './shared.utils'
import {
  PAYMENT_QUERY,
  PAYMENT_STATUS_QUERY,
  PaymentChargeData,
  PaymentStatusData,
} from './shared.queries'

@Injectable()
export class SharedTemplateApiService {
  constructor(
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
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
    expiresIn: number,
    locale = 'is',
  ) {
    const token = createAssignToken(
      application,
      getConfigValue(this.configService, 'jwtSecret'),
      expiresIn,
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

  async makeGraphqlQuery<T = unknown>(
    authorization: string,
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<GraphqlGatewayResponse<T>> {
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

  async createCharge(
    authorization: string,
    applicationId: string,
    chargeItemCode: string,
  ) {
    return this.makeGraphqlQuery<PaymentChargeData>(
      authorization,
      PAYMENT_QUERY,
      {
        input: {
          applicationId,
          chargeItemCode,
        },
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('graphql query failed')
        }

        return res
      })
      .then((res) => res.json())
      .then(({ errors, data }) => {
        if (errors && errors.length) {
          throw new Error('Creating the payment charge failed')
        }

        return data?.applicationPaymentCharge
      })
  }

  async getPaymentStatus(authorization: string, applicationId: string) {
    return await this.makeGraphqlQuery<PaymentStatusData>(
      authorization,
      PAYMENT_STATUS_QUERY,
      {
        applicationId,
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Couldnt query payment status')
        }
        return res
      })
      .then((res) => res.json())
      .then(({ data }) => {
        return data?.applicationPaymentStatus
      })
  }
}
