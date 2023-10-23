import { Inject, Injectable } from '@nestjs/common'

import {
  Application,
  ApplicationTypes,
  YES,
} from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationType,
  ConnectedApplications,
  Employment,
  FileType,
  HouseholdSupplementHousing,
  childCustodyLivesWithApplicant,
  getApplicationAnswers,
  isEarlyRetirement,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  Attachment,
  OldAgePensionResponseError,
  SocialInsuranceAdministrationClientService,
  Uploads,
} from '@island.is/clients/social-insurance-administration'
import { S3 } from 'aws-sdk'
import {
  getApplicationType,
  transformApplicationToOldAgePensionDTO,
} from './social-insurance-administration-utils'
import { coreErrorMessages } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class OldAgePensionService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {
    super(ApplicationTypes.OLD_AGE_PENSION)
  }

  private parseErrors(e: Error | OldAgePensionResponseError) {
    if (e instanceof Error) {
      return e.message
    }

    return { message: e.message }
  }

  private async initAttachments(
    application: Application,
    id: string,
    type: string,
    attachments: FileType[],
  ): Promise<Attachment[]> {
    const result: Attachment[] = []

    for (let i = 0; i <= attachments.length - 1; i++) {
      const pdf = await this.getPdf(application, i, id)
      result.push({
        name: attachments[i].name,
        type: type,
        file: pdf,
      })
    }

    return result
  }

  private async getAttachments(application: Application): Promise<Uploads> {
    const {
      additionalAttachments,
      pensionAttachments,
      fishermenAttachments,
      selfEmployedAttachments,
      earlyRetirementAttachments,
      leaseAgreementAttachments,
      schoolConfirmationAttachments,
      maintenanceAttachments,
      notLivesWithApplicantAttachments,
      childPensionAddChild,
      applicationType,
      connectedApplications,
      householdSupplementHousing,
      householdSupplementChildren,
      employmentStatus,
    } = getApplicationAnswers(application.answers)

    const uploads: Uploads = {}

    if (additionalAttachments && additionalAttachments.length > 0) {
      uploads.additional = await this.initAttachments(
        application,
        'fileUploadAdditionalFiles.additionalDocuments',
        'other',
        additionalAttachments,
      )
    }

    if (pensionAttachments && pensionAttachments.length > 0) {
      uploads.pension = await this.initAttachments(
        application,
        'fileUpload.pension',
        'pension',
        pensionAttachments,
      )
    }

    if (
      fishermenAttachments &&
      fishermenAttachments.length > 0 &&
      applicationType === ApplicationType.SAILOR_PENSION
    ) {
      uploads.sailorPension = await this.initAttachments(
        application,
        'fileUpload.fishermen',
        'sailor',
        fishermenAttachments,
      )
    }

    if (
      leaseAgreementAttachments &&
      leaseAgreementAttachments.length > 0 &&
      connectedApplications?.includes(
        ConnectedApplications.HOUSEHOLDSUPPLEMENT,
      ) &&
      householdSupplementHousing === HouseholdSupplementHousing.RENTER
    ) {
      uploads.householdSupplement = await this.initAttachments(
        application,
        'fileUploadHouseholdSupplement.leaseAgreement',
        'leaseAgreement',
        leaseAgreementAttachments,
      )
    }

    if (
      schoolConfirmationAttachments &&
      schoolConfirmationAttachments.length > 0 &&
      connectedApplications?.includes(
        ConnectedApplications.HOUSEHOLDSUPPLEMENT,
      ) &&
      householdSupplementChildren === YES
    ) {
      if (!uploads.householdSupplement) {
        uploads.householdSupplement = []
      }

      uploads.householdSupplement.push(
        ...(await this.initAttachments(
          application,
          'fileUploadHouseholdSupplement.schoolConfirmation',
          'schoolConfirmation',
          schoolConfirmationAttachments,
        )),
      )
    }

    if (
      maintenanceAttachments &&
      maintenanceAttachments.length > 0 &&
      connectedApplications?.includes(ConnectedApplications.CHILDPENSION) &&
      childPensionAddChild === YES
    ) {
      uploads.childPension = await this.initAttachments(
        application,
        'fileUploadChildPension.maintenance',
        'maintenance',
        maintenanceAttachments,
      )
    }

    if (
      notLivesWithApplicantAttachments &&
      notLivesWithApplicantAttachments.length > 0 &&
      connectedApplications?.includes(ConnectedApplications.CHILDPENSION) &&
      childCustodyLivesWithApplicant(
        application.answers,
        application.externalData,
      )
    ) {
      if (!uploads.childPension) {
        uploads.childPension = []
      }

      uploads.childPension.push(
        ...(await this.initAttachments(
          application,
          'fileUploadChildPension.notLivesWithApplicant',
          'childSupport',
          notLivesWithApplicantAttachments,
        )),
      )
    }

    if (
      selfEmployedAttachments &&
      selfEmployedAttachments.length > 0 &&
      employmentStatus === Employment.SELFEMPLOYED
    ) {
      uploads.halfOldAgePension = await this.initAttachments(
        application,
        'employment.selfEmployedAttachment',
        'selfEmployed',
        selfEmployedAttachments,
      )
    }

    if (
      isEarlyRetirement(application.answers, application.externalData) &&
      earlyRetirementAttachments &&
      earlyRetirementAttachments.length > 0
    ) {
      uploads.earlyRetirement = await this.initAttachments(
        application,
        'fileUpload.earlyRetirement',
        'earlyRetirement',
        earlyRetirementAttachments,
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

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const attachments = await this.getAttachments(application)

      const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
        application,
        attachments,
      )

      const applicationType = getApplicationType(application).toLowerCase()

      const response = await this.siaClientService.sendApplication(
        auth,
        oldAgePensionDTO,
        applicationType,
      )

      return response
    } catch (e) {
      this.logger.error('Failed to send the old age pension application', e)
      throw this.parseErrors(e)
    }
  }

  async getBankInfo({ auth }: TemplateApiModuleActionProps) {
    try {
      const res = await this.siaClientService.getBankInfo(auth)

      if (isRunningOnEnvironment('local')) {
        if (!res.bank) {
          ;(res.bank = '2222'),
            (res.ledger = '00'),
            (res.accountNumber = '123456')
        }
      }

      return res
    } catch (e) {
      throw new TemplateApiError(coreErrorMessages.defaultTemplateApiError, 500)
    }
  }
}
