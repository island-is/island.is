import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  type ApplicationWithAttachments,
} from '@island.is/application/types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ZendeskService } from '@island.is/clients/zendesk'
import { YesOrNoEnum, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type { ApplicationAnswers } from './types'

const GET_COURSE_BY_ID_QUERY = `
  query GetCourseById($input: GetCourseByIdInput!) {
    getCourseById(input: $input) {
      course {
        id
        title
        instances {
          id
          startDate
          startDateTimeDuration {
            startTime
            endTime
          }
          chargeItemCode
        }
      }
    }
  }
`

@Injectable()
export class CoursesService extends BaseTemplateApiService {
  private readonly zendeskSubject =
    process.env.HH_COURSES_ZENDESK_SUBJECT ||
    'Skráning á námskeið - Heilsugæsla höfuðborgarsvæðisins'

  constructor(
    private readonly sharedTemplateApiService: SharedTemplateApiService,
    private readonly zendeskService: ZendeskService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID)
  }

  async getSelectedChargeItem({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    chargeItemCode?: string | null
  }> {
    const courseId = getValueViaPath<ApplicationAnswers['courseSelect']>(
      application.answers,
      'courseSelect',
    )
    const courseInstanceId = getValueViaPath<ApplicationAnswers['dateSelect']>(
      application.answers,
      'dateSelect',
    )

    const { courseInstance } = await this.getCourseById(
      courseId,
      courseInstanceId,
      auth.authorization,
    )

    return { chargeItemCode: courseInstance.chargeItemCode }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    try {
      const { course, courseInstance } = await this.getCourseById(
        getValueViaPath<string>(application.answers, 'courseSelect', ''),
        getValueViaPath<string>(application.answers, 'dateSelect', ''),
        auth.authorization,
      )

      const participantList =
        getValueViaPath<ApplicationAnswers['participantList']>(
          application.answers,
          'participantList',
        ) ?? []

      const { name, email, phone, healthcenter, nationalId } =
        await this.extractApplicantInfo(application)

      if (!name || !email || !phone || !healthcenter || !nationalId)
        throw new TemplateApiError(
          {
            title: 'No contact information found',
            summary: 'No contact information found',
          },
          400,
        )

      let user = await this.zendeskService.getUserByEmail(email)

      if (!user) {
        user = await this.zendeskService.createUser(name, email, phone)
      }

      const message = await this.formatApplicationMessage(
        application,
        participantList,
        course.id,
        course.title,
        courseInstance,
        nationalId,
        name,
        email,
        phone,
        healthcenter,
      )

      await this.zendeskService.submitTicket({
        message,
        requesterId: user.id,
        subject: this.zendeskSubject,
        tags: ['hh-courses'],
      })

      return { success: true }
    } catch (error) {
      this.logger.error('Failed to submit HH courses application to Zendesk', {
        applicationId: application.id,
        error: error.message,
      })

      if (error instanceof TemplateApiError) {
        throw error
      }

      throw new TemplateApiError(
        {
          title: 'Failed to submit application',
          summary: error.message || 'An unexpected error occurred',
        },
        500,
      )
    }
  }

  private async getCourseById(
    courseId: string | undefined,
    courseInstanceId: string | undefined,
    authorization: string,
  ) {
    if (!courseId)
      throw new TemplateApiError(
        {
          title: 'Course id not provided',
          summary: 'Course id not provided',
        },
        400,
      )
    if (!courseInstanceId)
      throw new TemplateApiError(
        {
          title: 'Course instance id not provided',
          summary: 'Course instance id not provided',
        },
        400,
      )

    const response = await this.sharedTemplateApiService
      .makeGraphqlQuery<{
        getCourseById: {
          course: {
            id: string
            title: string
            instances: {
              id: string
              startDate: string
              startDateTimeDuration?: {
                startTime?: string
                endTime?: string
              }
              chargeItemCode?: string | null
            }[]
          }
        }
      }>(authorization, GET_COURSE_BY_ID_QUERY, {
        input: {
          id: courseId,
        },
      })
      .then((response) => response.json())

    const course = response.data?.getCourseById?.course
    const courseInstance = course?.instances.find(
      (instance) => instance.id === courseInstanceId,
    )

    if (!course)
      throw new TemplateApiError(
        {
          title: 'Course not found',
          summary: 'Course not found',
        },
        404,
      )
    if (!courseInstance)
      throw new TemplateApiError(
        {
          title: 'Course instance not found',
          summary: 'Course instance not found',
        },
        404,
      )

    return {
      course,
      courseInstance,
    }
  }

  private async extractApplicantInfo(application: ApplicationWithAttachments) {
    const nationalId = application.applicant

    const name = getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.data.fullName',
    )
    const email = getValueViaPath<string>(
      application.answers,
      'userInformation.email',
    )
    const phone = getValueViaPath<string>(
      application.answers,
      'userInformation.phone',
    )
    const healthcenter = getValueViaPath<string>(
      application.answers,
      'userInformation.healthcenter',
    )

    return {
      nationalId,
      name,
      email,
      phone,
      healthcenter,
    }
  }

  private async formatApplicationMessage(
    application: ApplicationWithAttachments,
    participantList: ApplicationAnswers['participantList'],
    courseId: string,
    courseTitle: string,
    courseInstance: {
      id: string
      startDate: string
      startDateTimeDuration?: {
        startTime?: string
        endTime?: string
      }
    },
    nationalId: string,
    name: string,
    email: string,
    phone: string,
    healthcenter: string,
  ): Promise<string> {
    const userIsPayingAsIndividual = getValueViaPath<YesOrNoEnum>(
      application.answers,
      'payment.userIsPayingAsIndividual',
      YesOrNoEnum.YES,
    )
    const companyPayment = getValueViaPath<{
      nationalIdWithName: {
        name: string
        nationalId: string
      }
    }>(application.answers, 'payment.companyPayment')

    let message = ''
    message += `ID á umsókn: ${application.id}\n`
    message += `Námskeið: ${courseTitle}\n`
    message += `ID á námskeiði: ${courseId}\n`
    message += `ID á upphafsdagsetningu: ${courseInstance.id}\n`

    let startDateTimeDuration = ''
    if (courseInstance.startDateTimeDuration?.startTime) {
      startDateTimeDuration = courseInstance.startDateTimeDuration.startTime
      if (courseInstance.startDateTimeDuration.endTime) {
        startDateTimeDuration += ` - ${courseInstance.startDateTimeDuration.endTime}`
      }
    }

    message += `Upphafsdagsetning: ${courseInstance.startDate.split('T')[0]} ${
      startDateTimeDuration ?? ''
    }\n`

    message += `Kennitala umsækjanda: ${nationalId}\n`
    message += `Nafn umsækjanda: ${name}\n`
    message += `Netfang umsækjanda: ${email}\n`
    message += `Símanúmer umsækjanda: ${phone}\n`
    message += `Heilsugæslustöð umsækjanda: ${healthcenter}\n`

    const payer =
      userIsPayingAsIndividual === YesOrNoEnum.YES
        ? {
            name: 'Umsækjandi (einstaklingsgreiðsla)',
            nationalId: application.applicant,
          }
        : companyPayment?.nationalIdWithName

    message += `Nafn greiðanda: ${payer?.name ?? ''}\n`
    message += `Kennitala greiðanda: ${payer?.nationalId ?? ''}\n`

    participantList.forEach((participant, index) => {
      const p = participant.nationalIdWithName
      message += `Nafn þátttakanda ${index + 1}: ${p.name}\n`
      message += `Kennitala þátttakanda ${index + 1}: ${p.nationalId}\n`
      message += `Netfang þátttakanda ${index + 1}: ${p.email}\n`
      message += `Símanúmer þátttakanda ${index + 1}: ${p.phone}\n`
    })

    return message
  }
}
