import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import cloneDeep from 'lodash/cloneDeep'

import type { Attachment, Period } from '@island.is/clients/vmst'
import { ParentalLeaveApi } from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Application, getValueViaPath } from '@island.is/application/core'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  getAvailablePersonalRightsInDays,
  YES,
  StartDateOptions,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'

import { SharedTemplateApiService } from '../../shared'
import {
  BaseTemplateAPIModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../types'
import {
  generateAssignOtherParentApplicationEmail,
  generateAssignEmployerApplicationEmail,
  generateOtherParentRejected,
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
} from './emailGenerators'
import {
  transformApplicationToParentalLeaveDTO,
  getRatio,
  createAssignTokenWithoutNonce,
} from './parental-leave.utils'
import { apiConstants } from './constants'
import { SmsService } from '@island.is/nova-sms'
import { ConfigService } from '@nestjs/config'
import { getConfigValue } from '../../shared/shared.utils'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60
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
    private readonly smsService: SmsService,
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
  ) {}

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    const { otherParentPhoneNumber } = getApplicationAnswers(
      application.answers,
    )
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )
    const applicantId = application.applicant

    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )

    if (otherParentPhoneNumber) {
      const token = createAssignTokenWithoutNonce(
        application,
        getConfigValue(this.configService, 'jwtSecret'),
        SIX_MONTHS_IN_SECONDS_EXPIRES,
      )

      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

      await this.smsService.sendSms(
        otherParentPhoneNumber,
        `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem maka í umsókn sinni um fæðingarorlof og er að óska eftir réttindum frá þér.
        Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður
        ${assignLink}`,
      )
    }
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
    const { employerPhoneNumber } = getApplicationAnswers(application.answers)
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )
    const applicantId = application.applicant

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
      SIX_MONTHS_IN_SECONDS_EXPIRES,
    )

    // send confirmation sms to employer
    if (employerPhoneNumber) {
      const token = createAssignTokenWithoutNonce(
        application,
        getConfigValue(this.configService, 'jwtSecret'),
        SIX_MONTHS_IN_SECONDS_EXPIRES,
      )
  
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string
  
      const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

      await this.smsService.sendSms(
        employerPhoneNumber,
        `Umsækjandi ${applicantName} kt: ${applicantId} hefur skráð þig sem atvinnuveitanda í umsókn sinni um fæðingarorlof.
        Ef þú áttir von á þessari beiðni máttu smella á linkinn hér fyrir neðan. Kveðja, Fæðingarorlofssjóður
        ${assignLink}`,
      )
    }
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
    const {
      periods: originalPeriods,
      firstPeriodStart,
    } = getApplicationAnswers(application.answers)

    const answers = cloneDeep(originalPeriods).sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)

      return dateA.getTime() - dateB.getTime()
    })

    const periods: Period[] = []
    const maximumDaysToSpend = getAvailableRightsInDays(application)
    const maximumPersonalDaysToSpend = getAvailablePersonalRightsInDays(
      application,
    )
    const isActualDateOfBirth =
      firstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH
    let numberOfDaysAlreadySpent = 0

    for (const [index, period] of answers.entries()) {
      const isFirstPeriod = index === 0
      const isUsingNumberOfDays = period.daysToUse !== undefined

      // If a period doesn't have both startDate or endDate we skip it
      if (!isFirstPeriod && (!period.startDate || !period.endDate)) {
        continue
      }

      const startDate = new Date(period.startDate)
      const endDate = new Date(period.endDate)

      let periodLength = 0

      if (isUsingNumberOfDays) {
        periodLength = Number(period.daysToUse)
      } else {
        const getPeriodLength = await this.parentalLeaveApi.parentalLeaveGetPeriodLength(
          { nationalRegistryId, startDate, endDate, percentage: period.ratio },
        )

        if (getPeriodLength.periodLength === undefined) {
          throw new Error(
            `Could not calculate length of period from ${period.startDate} to ${period.endDate}`,
          )
        }

        periodLength = Number(getPeriodLength.periodLength ?? 0)
      }

      const numberOfDaysSpentAfterPeriod =
        numberOfDaysAlreadySpent + periodLength

      if (numberOfDaysSpentAfterPeriod > maximumDaysToSpend) {
        throw new Error(
          `Period from ${period.startDate} to ${period.endDate} will exceed rights (${numberOfDaysSpentAfterPeriod} > ${maximumDaysToSpend})`,
        )
      }

      const isUsingTransferredRights =
        numberOfDaysAlreadySpent > maximumPersonalDaysToSpend
      const willStartToUseTransferredRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumPersonalDaysToSpend

      if (
        !isUsingTransferredRights &&
        !willStartToUseTransferredRightsWithPeriod
      ) {
        // We know its a normal period and it will not exceed personal rights
        periods.push({
          from:
            isFirstPeriod && isActualDateOfBirth
              ? apiConstants.actualDateOfBirth
              : period.startDate,
          to: period.endDate,
          ratio: getRatio(
            period.ratio,
            periodLength.toString(),
            isUsingNumberOfDays,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: null,
        })
      } else if (isUsingTransferredRights) {
        // We know all of the period will be using transferred rights
        periods.push({
          from:
            isFirstPeriod && isActualDateOfBirth
              ? apiConstants.actualDateOfBirth
              : period.startDate,
          to: period.endDate,
          ratio: getRatio(
            period.ratio,
            periodLength.toString(),
            isUsingNumberOfDays,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        })
      } else {
        // If we reach here, we have a period that will have to be split into
        // two, a part of it will be using personal rights and the other part
        // will be using transferred rights
        const daysLeftOfPersonalRights =
          maximumPersonalDaysToSpend - numberOfDaysAlreadySpent

        const getNormalPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
          {
            nationalRegistryId,
            startDate,
            length: String(daysLeftOfPersonalRights),
            percentage: period.ratio,
          },
        )

        if (getNormalPeriodEndDate.periodEndDate === undefined) {
          throw new Error(
            `Could not calculate end date of period starting ${period.startDate} and using ${daysLeftOfPersonalRights} days of rights`,
          )
        }

        // Add the period using personal rights
        periods.push({
          from:
            isFirstPeriod && isActualDateOfBirth
              ? apiConstants.actualDateOfBirth
              : period.startDate,
          to: format(getNormalPeriodEndDate.periodEndDate, df),
          ratio: getRatio(
            period.ratio,
            daysLeftOfPersonalRights.toString(),
            isUsingNumberOfDays,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: null,
        })

        const transferredPeriodStartDate = addDays(
          getNormalPeriodEndDate.periodEndDate,
          1,
        )
        const lengthOfPeriodUsingTransferredDays =
          periodLength - daysLeftOfPersonalRights

        const getTransferredPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
          {
            nationalRegistryId,
            startDate: transferredPeriodStartDate,
            length: String(lengthOfPeriodUsingTransferredDays),
            percentage: period.ratio,
          },
        )

        if (getTransferredPeriodEndDate.periodEndDate === undefined) {
          throw new Error(
            `Could not calculate end date of period starting ${period.startDate} and using ${lengthOfPeriodUsingTransferredDays} days of rights`,
          )
        }

        // Add the period using transferred rights
        periods.push({
          from: format(transferredPeriodStartDate, df),
          to: format(getTransferredPeriodEndDate.periodEndDate, df),
          ratio: getRatio(
            period.ratio,
            lengthOfPeriodUsingTransferredDays.toString(),
            isUsingNumberOfDays,
          ),
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        })
      }

      // Add each period to the total number of days spent when an iteration is finished
      numberOfDaysAlreadySpent += periodLength
    }

    return periods
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const { isSelfEmployed } = getApplicationAnswers(application.answers)
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
        throw new Error(
          `Failed to send the parental leave application, no response.id from VMST API: ${response}`,
        )
      }

      const selfEmployed = isSelfEmployed === YES

      if (!selfEmployed) {
        // Only needs to send an email if being approved by employer
        // Self employed applicant was aware of the approval
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedByEmployerEmail,
          application,
        )

        // Also send confirmation to employer
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationApprovedByEmployerToEmployerEmail,
          application,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send the parental leave application', e)
      throw this.parseErrors(e)
    }
  }
}
