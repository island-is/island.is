import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import cloneDeep from 'lodash/cloneDeep'

import type { Attachment, Period } from '@island.is/clients/vmst'
import { ParentalLeaveApi } from '@island.is/clients/vmst'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationConfigurations,
  Application,
  ApplicationTypes,
} from '@island.is/application/types'
import {
  getApplicationAnswers,
  getAvailableRightsInDays,
  getAvailablePersonalRightsInDays,
  YES,
  StartDateOptions,
  UnEmployedBenefitTypes,
  PARENTAL_LEAVE,
  PARENTAL_GRANT_STUDENTS,
  SINGLE,
  getAdditionalSingleParentRightsInDays,
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
  generateEmployerRejected,
  generateApplicationApprovedByEmployerEmail,
  generateApplicationApprovedByEmployerToEmployerEmail,
} from './emailGenerators'
import {
  generateAssignEmployerApplicationSms,
  generateAssignOtherParentApplicationSms,
  generateEmployerRejectedApplicationSms,
  generateOtherParentRejectedApplicationSms,
} from './smsGenerators'
import {
  transformApplicationToParentalLeaveDTO,
  getRatio,
  getRightsCode,
} from './parental-leave.utils'
import { apiConstants } from './constants'
import { ConfigService } from '@nestjs/config'
import { getConfigValue } from '../../shared/shared.utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ChildrenService } from './children/children.service'

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
export class ParentalLeaveService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private parentalLeaveApi: ParentalLeaveApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
    private readonly childrenService: ChildrenService,
  ) {
    super(ApplicationTypes.PARENTAL_LEAVE)
  }

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async getChildren({ application, auth }: TemplateApiModuleActionProps) {
    return this.childrenService.provideChildren(application, auth.nationalId)
  }

  async assignOtherParent({ application }: TemplateApiModuleActionProps) {
    const { otherParentPhoneNumber } = getApplicationAnswers(
      application.answers,
    )

    await this.sharedTemplateAPIService.sendEmail(
      generateAssignOtherParentApplicationEmail,
      application,
    )

    if (otherParentPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string
      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateAssignOtherParentApplicationSms(application, link),
        application,
      )
    }
  }

  async notifyApplicantOfRejectionFromOtherParent({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateOtherParentRejected,
      application,
    )

    if (applicantPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateOtherParentRejectedApplicationSms(application, link),
        application,
      )
    }
  }

  async notifyApplicantOfRejectionFromEmployer({
    application,
  }: TemplateApiModuleActionProps) {
    const { applicantPhoneNumber } = getApplicationAnswers(application.answers)

    await this.sharedTemplateAPIService.sendEmail(
      generateEmployerRejected,
      application,
    )

    if (applicantPhoneNumber) {
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

      await this.sharedTemplateAPIService.sendSms(
        () => generateEmployerRejectedApplicationSms(application, link),
        application,
      )
    }
  }

  async assignEmployer({ application }: TemplateApiModuleActionProps) {
    const { employerPhoneNumber } = getApplicationAnswers(application.answers)

    const token = await this.sharedTemplateAPIService.createAssignToken(
      application,
      SIX_MONTHS_IN_SECONDS_EXPIRES,
    )

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignEmployerApplicationEmail,
      application,
      token,
    )

    // send confirmation sms to employer
    if (employerPhoneNumber) {
      await this.sharedTemplateAPIService.assignApplicationThroughSms(
        generateAssignEmployerApplicationSms,
        application,
        token,
      )
    }
  }

  async getSelfEmployedPdf(application: Application, index = 0) {
    try {
      let filename = getValueViaPath(
        application.answers,
        `employer.selfEmployed.file[${index}].key`,
      )

      if (!filename) {
        filename = getValueViaPath(
          application.answers,
          `fileUpload.selfEmployedFile[${index}].key`,
        )
      }

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

  async getStudentPdf(application: Application, index = 0) {
    try {
      const filename = getValueViaPath(
        application.answers,
        `fileUpload.studentFile[${index}].key`,
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
      this.logger.error('Cannot get student attachment', { e })
      throw new Error('Failed to get the student attachment')
    }
  }

  async getBenefitsPdf(application: Application, index = 0) {
    try {
      const filename = getValueViaPath(
        application.answers,
        `fileUpload.benefitsFile[${index}].key`,
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
      this.logger.error('Cannot get benefits attachment', { e })
      throw new Error('Failed to get the benefits attachment')
    }
  }

  async getSingleParentPdf(application: Application, index = 0) {
    try {
      const filename = getValueViaPath(
        application.answers,
        `fileUpload.singleParent[${index}].key`,
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
      this.logger.error('Cannot get single parent attachment', { e })
      throw new Error('Failed to get the single parent attachment')
    }
  }

  async getGenericPdf(application: Application, index = 0) {
    try {
      const filename = getValueViaPath(
        application.answers,
        `fileUpload.file[${index}].key`,
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
      this.logger.error('Cannot get attachment', { e })
      throw new Error('Failed to get the attachment')
    }
  }

  async getAttachments(application: Application): Promise<Attachment[]> {
    const attachments: Attachment[] = []
    const {
      isSelfEmployed,
      applicationType,
      otherParent,
    } = getApplicationAnswers(application.answers)

    if (isSelfEmployed === YES && applicationType === PARENTAL_LEAVE) {
      const selfEmployedPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.selfEmployedFile',
      )) as unknown[]

      if (selfEmployedPdfs?.length) {
        for (let i = 0; i <= selfEmployedPdfs.length - 1; i++) {
          const pdf = await this.getSelfEmployedPdf(application, i)

          attachments.push({
            attachmentType: apiConstants.attachments.selfEmployed,
            attachmentBytes: pdf,
          })
        }
      } else {
        const oldSelfEmployedPdfs = (await getValueViaPath(
          application.answers,
          'employer.selfEmployed.file',
        )) as unknown[]

        if (oldSelfEmployedPdfs?.length) {
          for (let i = 0; i <= oldSelfEmployedPdfs.length - 1; i++) {
            const pdf = await this.getSelfEmployedPdf(application, i)

            attachments.push({
              attachmentType: apiConstants.attachments.selfEmployed,
              attachmentBytes: pdf,
            })
          }
        }
      }
    } else if (applicationType === PARENTAL_GRANT_STUDENTS) {
      const stuydentPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.studentFile',
      )) as unknown[]

      if (stuydentPdfs?.length) {
        for (let i = 0; i <= stuydentPdfs.length - 1; i++) {
          const pdf = await this.getStudentPdf(application, i)

          attachments.push({
            attachmentType: apiConstants.attachments.student,
            attachmentBytes: pdf,
          })
        }
      }
    }

    if (otherParent === SINGLE) {
      const singleParentPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.singleParent',
      )) as unknown[]

      if (singleParentPdfs?.length) {
        for (let i = 0; i <= singleParentPdfs.length - 1; i++) {
          const pdf = await this.getSingleParentPdf(application, i)

          attachments.push({
            attachmentType: apiConstants.attachments.artificialInsemination,
            attachmentBytes: pdf,
          })
        }
      }
    }

    const {
      isRecivingUnemploymentBenefits,
      unemploymentBenefits,
    } = getApplicationAnswers(application.answers)
    if (
      isRecivingUnemploymentBenefits === YES &&
      (unemploymentBenefits === UnEmployedBenefitTypes.union ||
        unemploymentBenefits == UnEmployedBenefitTypes.healthInsurance)
    ) {
      const benefitsPdfs = (await getValueViaPath(
        application.answers,
        'fileUpload.benefitsFile',
      )) as unknown[]

      if (benefitsPdfs?.length) {
        for (let i = 0; i <= benefitsPdfs.length - 1; i++) {
          const pdf = await this.getBenefitsPdf(application, i)

          attachments.push({
            attachmentType: apiConstants.attachments.unEmploymentBenefits,
            attachmentBytes: pdf,
          })
        }
      }
    }

    const genericPdfs = (await getValueViaPath(
      application.answers,
      'fileUpload.file',
    )) as unknown[]

    if (genericPdfs?.length) {
      for (let i = 0; i <= genericPdfs.length - 1; i++) {
        const pdf = await this.getGenericPdf(application, i)

        attachments.push({
          attachmentType: apiConstants.attachments.other,
          attachmentBytes: pdf,
        })
      }
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
      otherParent,
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
    const maximumAdditionalSingleParentDaysToSpend = getAdditionalSingleParentRightsInDays(
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
      const useLength = period.useLength

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

      const isUsingAdditionalRights =
        numberOfDaysAlreadySpent >=
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const willStartToUseAdditionalSingleParentRightsWithPeriod =
        numberOfDaysSpentAfterPeriod >
        maximumDaysToSpend - maximumAdditionalSingleParentDaysToSpend
      const isUsingTransferredRights =
        numberOfDaysAlreadySpent >= maximumPersonalDaysToSpend
      const willStartToUseTransferredRightsWithPeriod =
        numberOfDaysSpentAfterPeriod > maximumPersonalDaysToSpend

      if (
        !isUsingTransferredRights &&
        !willStartToUseTransferredRightsWithPeriod &&
        !isUsingAdditionalRights &&
        !willStartToUseAdditionalSingleParentRightsWithPeriod
      ) {
        // We know its a normal period and it will not exceed personal rights
        periods.push({
          from:
            isFirstPeriod && isActualDateOfBirth && useLength === YES
              ? apiConstants.actualDateOfBirthMonths
              : isFirstPeriod && isActualDateOfBirth
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
          rightsCodePeriod: getRightsCode(application),
        })
      } else if (otherParent === SINGLE) {
        // single parent
        if (isUsingAdditionalRights) {
          // We know all of the period will be using additional single parent rights
          periods.push({
            from:
              isFirstPeriod && isActualDateOfBirth && useLength === YES
                ? apiConstants.actualDateOfBirthMonths
                : isFirstPeriod && isActualDateOfBirth
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
            rightsCodePeriod:
              apiConstants.rights.artificialInseminationRightsId,
          })
        } else {
          // If we reach here, we have a period that will have to be split into
          // two, a part of it will be using personal rights and the other part
          // will be using additional single parent rights
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
              isFirstPeriod && isActualDateOfBirth && useLength === YES
                ? apiConstants.actualDateOfBirthMonths
                : isFirstPeriod && isActualDateOfBirth
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
            rightsCodePeriod: getRightsCode(application),
          })

          const additionalSingleParentPeriodStartDate = addDays(
            getNormalPeriodEndDate.periodEndDate,
            1,
          )
          const lengthOfPeriodUsingAdditionalSingleParentDays =
            periodLength - daysLeftOfPersonalRights

          const getAdditionalSingleParentPeriodEndDate = await this.parentalLeaveApi.parentalLeaveGetPeriodEndDate(
            {
              nationalRegistryId,
              startDate: additionalSingleParentPeriodStartDate,
              length: String(lengthOfPeriodUsingAdditionalSingleParentDays),
              percentage: period.ratio,
            },
          )

          if (
            getAdditionalSingleParentPeriodEndDate.periodEndDate === undefined
          ) {
            throw new Error(
              `Could not calculate end date of period starting ${period.startDate} and using ${lengthOfPeriodUsingAdditionalSingleParentDays} days of rights`,
            )
          }

          // Add the period using additional single parent rights
          periods.push({
            from: format(additionalSingleParentPeriodStartDate, df),
            to: format(
              getAdditionalSingleParentPeriodEndDate.periodEndDate,
              df,
            ),
            ratio: getRatio(
              period.ratio,
              lengthOfPeriodUsingAdditionalSingleParentDays.toString(),
              isUsingNumberOfDays,
            ),
            approved: false,
            paid: false,
            rightsCodePeriod:
              apiConstants.rights.artificialInseminationRightsId,
          })
        }
      } else {
        // other parent
        if (isUsingTransferredRights) {
          // We know all of the period will be using transferred rights
          periods.push({
            from:
              isFirstPeriod && isActualDateOfBirth && useLength === YES
                ? apiConstants.actualDateOfBirthMonths
                : isFirstPeriod && isActualDateOfBirth
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
              isFirstPeriod && isActualDateOfBirth && useLength === YES
                ? apiConstants.actualDateOfBirthMonths
                : isFirstPeriod && isActualDateOfBirth
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
            rightsCodePeriod: getRightsCode(application),
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
      }

      // Add each period to the total number of days spent when an iteration is finished
      numberOfDaysAlreadySpent += periodLength
    }

    return periods
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const {
      isSelfEmployed,
      isRecivingUnemploymentBenefits,
      applicationType,
    } = getApplicationAnswers(application.answers)
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
        false, // put false in testData as this is not dummy request
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

      // There has been case when island.is got Access Denied from AWS when sending out emails
      // This try/catch keeps application in correct state
      try {
        const selfEmployed =
          applicationType === PARENTAL_LEAVE ? isSelfEmployed === YES : true
        const recivingUnemploymentBenefits =
          isRecivingUnemploymentBenefits === YES

        if (!selfEmployed && !recivingUnemploymentBenefits) {
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
      } catch (e) {
        this.logger.error(
          'Failed to send confirmation emails to applicant and employer in parental leave application',
          e,
        )
      }

      return response
    } catch (e) {
      this.logger.error('Failed to send the parental leave application', e)
      throw this.parseErrors(e)
    }
  }

  async validateApplication({ application }: TemplateApiModuleActionProps) {
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
        true,
      )

      // call SetParentalLeave API with testData: TRUE as this is a dummy request
      // for validation purposes
      await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
        nationalRegistryId,
        parentalLeave: parentalLeaveDTO,
      })

      return
    } catch (e) {
      this.logger.error('Failed to validate the parental leave application', e)
      throw this.parseErrors(e as VMSTError)
    }
  }
}
