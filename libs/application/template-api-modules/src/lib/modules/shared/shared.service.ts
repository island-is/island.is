import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmailService } from '@island.is/email-service'
import {
  Application,
  ApplicationWithAttachments,
  GraphqlGatewayResponse,
} from '@island.is/application/types'
import {
  BaseTemplateAPIModuleConfig,
  EmailTemplateGenerator,
  AssignmentEmailTemplateGenerator,
  AttachmentEmailTemplateGenerator,
  BaseTemplateApiApplicationService,
  AssignmentSmsTemplateGenerator,
  SmsTemplateGenerator,
} from '../../types'
import { getConfigValue } from './shared.utils'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import { S3 } from 'aws-sdk'
import AmazonS3URI from 'amazon-s3-uri'
import { PaymentService } from '@island.is/application/api/payment'
import { User } from '@island.is/auth-nest-tools'
import { ExtraData } from '@island.is/clients/charge-fjs-v2'

@Injectable()
export class SharedTemplateApiService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(SmsService)
    private readonly smsService: SmsService,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    @Inject(BaseTemplateApiApplicationService)
    private readonly applicationService: BaseTemplateApiApplicationService,
    private readonly paymentService: PaymentService,
  ) {
    this.s3 = new S3()
  }

  async createAssignToken(application: Application, expiresIn: number) {
    const token = await this.applicationService.createAssignToken(
      application,
      getConfigValue(this.configService, 'jwtSecret'),
      expiresIn,
    )

    return token
  }

  async sendSms(
    smsTemplateGenerator: SmsTemplateGenerator,
    application: Application,
  ) {
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    const { phoneNumber, message } = smsTemplateGenerator(application, {
      clientLocationOrigin,
    })

    return this.smsService.sendSms(phoneNumber, message)
  }

  async assignApplicationThroughSms(
    smsTemplateGenerator: AssignmentSmsTemplateGenerator,
    application: Application,
    token: string,
  ) {
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

    const { phoneNumber, message } = smsTemplateGenerator(
      application,
      assignLink,
    )

    return this.smsService.sendSms(phoneNumber, message)
  }

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
    token: string,
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
    user: User,
    applicationId: string,
    performingOrganizationID: string,
    chargeItemCodes: string[],
    extraData: ExtraData[] | undefined = undefined,
  ) {
    return this.paymentService.createCharge(
      user,
      performingOrganizationID,
      chargeItemCodes,
      applicationId,
      extraData,
    )
  }

  async getPaymentStatus(user: User, applicationId: string) {
    return this.paymentService.getStatus(user, applicationId)
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

  async getAttachmentContentAsBase64(
    application: ApplicationWithAttachments,
    attachmentKey: string,
  ): Promise<string> {
    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    const file = await this.s3
      .getObject({
        Bucket: uploadBucket,
        Key: key,
      })
      .promise()
    const fileContent = file.Body as Buffer
    return fileContent?.toString('base64') || ''
  }
}
