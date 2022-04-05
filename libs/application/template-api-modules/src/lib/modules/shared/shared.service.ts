import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmailService } from '@island.is/email-service'
import {
  Application,
  ApplicationWithAttachments,
  GraphqlGatewayResponse,
} from '@island.is/application/core'
import {
  BaseTemplateAPIModuleConfig,
  EmailTemplateGenerator,
  AssignmentEmailTemplateGenerator,
  AttachmentEmailTemplateGenerator,
  BaseTemplateApiApplicationService,
} from '../../types'
import { getConfigValue } from './shared.utils'
import {
  PAYMENT_QUERY,
  PAYMENT_STATUS_QUERY,
  PaymentChargeData,
  PaymentStatusData,
} from './shared.queries'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SharedTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    @Inject(BaseTemplateApiApplicationService)
    private readonly applicationService: BaseTemplateApiApplicationService,
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
    const token = await this.applicationService.createAssignToken(
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
  ): Promise<PaymentChargeData['applicationPaymentCharge']> {
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
          this.logger.error('Graphql errors', {
            errors,
          })

          throw new Error('Graphql errors present')
        }

        if (!data?.applicationPaymentCharge) {
          throw new Error(
            'no graphql error, but payment object was not returned',
          )
        }

        return data.applicationPaymentCharge
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

  async addAttachment(
    application: ApplicationWithAttachments,
    fileName: string,
    buffer: Buffer,
    uploadParameters?: {
      ContentType?: string
      ContentDisposition?: string
      ContentEncoding?: string
    },
  ): Promise<string> {
    return this.applicationService.saveAttachmentToApplicaton(
      application,
      fileName,
      buffer,
      uploadParameters,
    )
  }
}
