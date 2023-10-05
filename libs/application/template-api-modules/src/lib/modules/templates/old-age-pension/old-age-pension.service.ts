import { Inject, Injectable } from '@nestjs/common'

import { Application, ApplicationTypes } from '@island.is/application/types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'

import {
  HelloOddurApi,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'
import { transformApplicationToOldAgePensionDTO } from './old-age-pension-utils'
import { getValueViaPath } from '@island.is/application/core'
import { S3 } from 'aws-sdk'
import { getApplicationAnswers } from '@island.is/application/templates/old-age-pension'

interface customError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class OldAgePensionService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    private helloOddurApi: HelloOddurApi,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {
    super(ApplicationTypes.OLD_AGE_PENSION)
  }

  private parseErrors(e: Error | customError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  private async initFiles(
    application: Application,
    id: string,
    type: string,
    documents: any[],
  ): Promise<any[]> {
    const attachments: any[] = []

    for (let i = 0; i <= documents.length - 1; i++) {
      const pdf = await this.getPdf(application, i, id)
      attachments.push({
        name: documents[i].name,
        type: type,
        file: pdf,
      })
    }

    return attachments
  }

  // TODO: Replace any with attachment types
  //private async getAttachments(application: Application): Promise<Attachment[]> {
  //const attachments: Attachment[] = []

  private async getAttachments(application: Application): Promise<any> {
    const {
      additionalFiles,
      pensionFiles,
      fishermenFiles,
      selfEmployedFiles,
      earlyRetirementFiles,
      leaseAgreementFiles,
      schoolConfirmationFiles,
      maintenanceFiles,
      notLivesWithApplicantFiles,
    } = getApplicationAnswers(application.answers)

    const uploads = {
      childPension: [] as any,
      sailorPension: [] as any,
      additional: [] as any,
      householdSupplement: [] as any,
      pension: [] as any,
      halfOldAgePension: [] as any,
      earlyRetirement: [] as any,
    }

    if (additionalFiles) {
      uploads.additional = await this.initFiles(
        application,
        'fileUploadAdditionalFiles.additionalDocuments',
        'other',
        additionalFiles,
      )
    }

    if (pensionFiles) {
      uploads.pension = await this.initFiles(
        application,
        'fileUploadEarlyPenFisher.pension',
        'pension',
        pensionFiles,
      )
    }

    if (fishermenFiles) {
      uploads.sailorPension = await this.initFiles(
        application,
        'fileUploadEarlyPenFisher.fishermen',
        'sailor',
        fishermenFiles,
      )
    }

    if (leaseAgreementFiles) {
      uploads.householdSupplement = await this.initFiles(
        application,
        'fileUploadHouseholdSupplement.leaseAgreement',
        'leaseAgreement',
        leaseAgreementFiles,
      )
    }

    if (schoolConfirmationFiles) {
      uploads.householdSupplement.push(
        ...(await this.initFiles(
          application,
          'fileUploadHouseholdSupplement.schoolConfirmation',
          'schoolConfirmation',
          schoolConfirmationFiles,
        )),
      )
    }

    if (maintenanceFiles) {
      uploads.childPension = await this.initFiles(
        application,
        'fileUploadChildPension.maintenance',
        'maintenance',
        maintenanceFiles,
      )
    }

    if (notLivesWithApplicantFiles) {
      uploads.childPension.push(
        ...(await this.initFiles(
          application,
          'fileUploadChildPension.notLivesWithApplicant',
          'childSupport',
          notLivesWithApplicantFiles,
        )),
      )
    }

    if (selfEmployedFiles) {
      uploads.halfOldAgePension = await this.initFiles(
        application,
        'employment.selfEmployedAttachment',
        'selfEmployed',
        selfEmployedFiles,
      )
    }

    if (earlyRetirementFiles) {
      uploads.earlyRetirement = await this.initFiles(
        application,
        'fileUploadEarlyPenFisher.earlyRetirement',
        'earlyRetirement',
        earlyRetirementFiles,
      )
    }

    return uploads
  }

  async getPdf(application: Application, index = 0, fileUpload: string) {
    try {
      const filename = getValueViaPath(
        application.answers,
        fileUpload + `[${index}].key`,
      )

      const Key = `${application.id}/${filename}`

      const file = await this.s3
        .getObject({ Bucket: this.attachmentBucket, Key })
        .promise()
      const fileContent = file.Body as Buffer

      if (!fileContent) {
        throw new Error('File content was undefined')
      }

      return fileContent.toString('base64')
    } catch (e) {
      this.logger.error('Cannot get ' + fileUpload + ' attachment', { e })
      throw new Error('Failed to get the ' + fileUpload + ' attachment')
    }
  }

  async helloWorld({ application, auth }: TemplateApiModuleActionProps) {
    let response

    try {
      response = await this.siaClientService.getOddur(auth)
    } catch (e) {
      throw new TemplateApiError(
        {
          title: 'Computer says NO!',
          summary: 'Villa hjá TR',
        },
        500,
      )
    }

    return response
  }

  async getStatus({ application, auth }: TemplateApiModuleActionProps) {
    console.log('--------------- AUTH -------------------', auth)

    /*
    When applicant creates new application:
    If no application, create new one
    If there is application with status ‘TRYGGINGASTOFNUN_SUBMITTED' ( send to TR and waiting for them to open ), No creating new application, can only change old one
    If there is application with status ‘TRYGGINGASTOFNUN_IN_REVIEW’ or 'REJECTED’, create new one
    */

    try {
      const resp = await this.siaClientService.getStatus(auth)

      console.log('Computer says OK!!!!', resp)
    } catch (e) {
      this.logger.error('No HELLO!!!!', e)

      throw new TemplateApiError(
        {
          title: 'Computer says NO!',
          summary: 'Villa hjá TR',
        },
        500,
      )
    }

    return true
  }

  async sendApplication({
    application,
    params = undefined,
  }: TemplateApiModuleActionProps) {
    try {
      console.log('-------------- OLD AGE  sendApplication  -----------------')

      const attachments = await this.getAttachments(application)

      const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
        application,
        attachments,
      )

      /*const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
        false, // put false in testData as this is not dummy request
        this.checkActionName(application, actionNameFromParams),
      )

*/

      console.log(' !!!!!!!!!!!!!! DATA FOR TR   !!!!!!!!!!!!!!!!!!')
      console.log(oldAgePensionDTO)

      const response = undefined // await this.siaClientService.()

      return response
    } catch (e) {
      this.logger.error('Failed to send the old age pension application', e)
      throw this.parseErrors(e)
    }
  }
}
