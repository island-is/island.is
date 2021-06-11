import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'

import type { Attachment, Period } from '@island.is/clients/vmst'
import { ParentalLeaveApi } from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Application, getValueViaPath } from '@island.is/application/core'
import {
  getApplicationAnswers,
  getSelectedChild,
  YES,
} from '@island.is/application/templates/parental-leave'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateOtherParentRejected,
  generateApplicationApprovedByEmployerEmail,
} from './emailGenerators'
import {
  getEmployer,
  transformApplicationToParentalLeaveDTO,
} from './parental-leave.utils'
import { apiConstants } from './constants'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
const df = 'yyyy-MM-dd'

@Injectable()
export class ParentalLeaveService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {}

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )
  }

  async notifyApplicantOfRejectionFromOtherParent({
    application,
  }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateOtherParentRejected,
      application,
    )
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
    )
  }

  async getSelfEmployedPdf(application: Application) {
    try {
      const filename = getValueViaPath(
        application.answers,
        'employer.selfEmployed.file[0].key',
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
      this.logger.error('Cannot get self employed attachment', { e })
      throw new Error('Failed to get the self employed attachment')
    }
  }

  async getAttachments(application: Application): Promise<Attachment[]> {
    const attachments: Attachment[] = []
    const { isSelfEmployed } = getApplicationAnswers(application.answers)

    if (isSelfEmployed === YES) {
      const pdf = await this.getSelfEmployedPdf(application)

      attachments.push({
        attachmentType: apiConstants.attachments.selfEmployed,
        attachmentBytes: pdf,
      })
    }

    return attachments
  }

  async createPeriodsDTO(
    application: Application,
    nationalRegistryId: string,
  ): Promise<Period[]> {
    const { periods: answers } = getApplicationAnswers(application.answers)
    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (!selectedChild) {
      throw new Error('Missing selected child')
    }

    let daysAllowed = selectedChild.remainingDays
    let periods: Period[] = []
    let extraDaysToTransformIntoPeriod = 0

    for (const period of answers) {
      const startDate = new Date(period.startDate)
      const endDate = new Date(period.endDate)
      const getPeriodLength = await this.parentalLeaveApi.parentalLeaveGetPeriodLength(
        { nationalRegistryId, startDate, endDate, percentage: period.ratio },
      )
      const periodLength = Number(getPeriodLength?.periodLength ?? 0)

      if (daysAllowed > periodLength) {
        periods.push({
          from: period.startDate,
          to: period.endDate,
          ratio: Number(period.ratio),
          approved: false,
          paid: false,
          rightsCodePeriod: null,
        })

        daysAllowed = daysAllowed - periodLength
      } else if (daysAllowed > 0) {
        const getPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
          {
            nationalRegistryId,
            startDate,
            length: String(daysAllowed),
            percentage: period.ratio,
          },
        )
        const periodEndDate = getPeriodEndDate?.periodEndDate

        if (periodEndDate) {
          periods.push({
            from: period.startDate,
            to: format(periodEndDate, df),
            ratio: Number(period.ratio),
            approved: false,
            paid: false,
            rightsCodePeriod: null,
          })
        }

        daysAllowed = 0
        extraDaysToTransformIntoPeriod = 45
      }
    }

    if (extraDaysToTransformIntoPeriod > 0) {
      const extraStartDate = addDays(
        new Date(periods[periods.length - 1].to),
        1,
      )
      const getExtraPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
        {
          nationalRegistryId,
          startDate: extraStartDate,
          length: String(extraDaysToTransformIntoPeriod),
          percentage: '100',
        },
      )
      const extraPeriodEndDate = getExtraPeriodEndDate?.periodEndDate

      if (extraPeriodEndDate) {
        periods.push({
          from: format(extraStartDate, df),
          to: format(extraPeriodEndDate, df),
          ratio: 100,
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        })
      }
    }

    return periods
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const nationalRegistryId = application.applicant
    const attachments = await this.getAttachments(application)

    try {
      const periods = await this.createPeriodsDTO(
        application,
        nationalRegistryId,
      )

      const parentalLeaveDTO = transformApplicationToParentalLeaveDTO(
        application,
        periods,
        attachments,
      )

      const response = await this.parentalLeaveApi.parentalLeaveSetParentalLeave(
        {
          nationalRegistryId,
          parentalLeave: parentalLeaveDTO,
        },
      )

      if (!response.id) {
        throw new Error(`Failed to send application: ${response.status}`)
      }

      const employer = getEmployer(application)
      const isEmployed = employer.nationalRegistryId !== application.applicant

      if (isEmployed) {
        // Only needs to send an email if being approved by employer
        // If self employed applicant was aware of the approval
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedByEmployerEmail,
          application,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send application', e)
      throw e
    }
  }
}
