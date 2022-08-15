import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'

import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'
import { SyslumennService } from '@island.is/clients/syslumenn'
import {
  File,
  ApplicationAttachments,
  AttachmentData,
  AttachmentPaths,
} from './types/attachments'
import { ApplicationWithAttachments } from '@island.is/application/types'

@Injectable()
export class OperatingLicenseService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
  ) {
    this.s3 = new S3()
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const chargeItemCode = getValueViaPath<string>(answers, 'chargeItemCode')
    if (!chargeItemCode) {
      throw new Error('chargeItemCode missing in request')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      chargeItemCode,
    )
    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitOperatingLicenseApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string
  }> {
    const { answers } = application
    console.log(answers.attachments)
    // const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
    //   auth.authorization,
    //   application.id,
    // )

    // if (!isPayment?.fulfilled) {
    //   this.logger.error(
    //     'Trying to submit OperatingLicenseapplication that has not been paid.',
    //   )
    //   throw new Error(
    //     'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
    //   )
    // }

    let result
    try {
      // TODO: Submit to syslumenn
      this.getAttachments(application)
      result = { success: false, errorMessage: null }
    } catch (e) {
      this.log('error', 'Submitting operating license failed', {
        e,
      })

      throw e
    }

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    return {
      success: true,
      orderId: 'PÖNTUN12345',
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[operation-license] ${message}`, meta)
  }

  private async getAttachments(
    application: ApplicationWithAttachments): Promise<string> {
    const attachments: AttachmentData[] = []
      console.log("HAHAHHAHDFASDFKAS D")
    for (let i = 0; i < AttachmentPaths.length; i++) {
      const { path, prefix } = AttachmentPaths[i]
      const attachmentAnswerData = getValueViaPath(
        application.answers,
        path,
      ) as File[]
      const attachmentAnswer = attachmentAnswerData.pop()
        console.log(attachmentAnswer)
      if (attachmentAnswer) {
        const fileType = attachmentAnswer.name?.split('.').pop()
        const name: string = `${prefix}_${new Date().toString()}.${fileType}`
        console.log("KEY",  attachmentAnswer?.key)
        const fileName = (application.attachments as ApplicationAttachments)[
          attachmentAnswer?.key
        ]
        console.log(fileName)
        const content = await this.getFileContentBase64(fileName)
        attachments.push({ name, content } as AttachmentData)
      }
    }

    console.log(attachments)

    return ''
  }

  private async getFileContentBase64(fileName: string): Promise<string> {
    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
      .getObject({
        Bucket: uploadBucket,
        Key: key,
      })
      .promise()
    const fileContent = file.Body as Buffer
    return fileContent?.toString('base64') || ''
    } catch ( e) {
      console.log("ERR", e)
      return 'err'
    }
    
  }
}
