import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  type ExternalData,
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
      id
      title
      instances {
        id
        startDate
        startDateTimeDuration {
          startTime
          endTime
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

      const { applicantName, applicantEmail, applicantPhone } =
        await this.extractApplicantInfo(application.externalData)

      const firstParticipant = participantList.find(
        (participant) =>
          Boolean(participant?.nationalIdWithName?.name) &&
          Boolean(participant?.nationalIdWithName?.email) &&
          Boolean(participant?.nationalIdWithName?.phone),
      )

      let name = ''
      let email = ''
      let phone = ''

      if (firstParticipant) {
        name = firstParticipant?.nationalIdWithName?.name ?? ''
        email = firstParticipant?.nationalIdWithName?.email ?? ''
        phone = firstParticipant?.nationalIdWithName?.phone ?? ''
      } else {
        name = applicantName ?? ''
        email = applicantEmail ?? ''
        phone = applicantPhone ?? ''
      }

      if (!name || !email || !phone)
        throw new TemplateApiError(
          {
            title: 'No contact information found',
            summary:
              'Neither applicant nor participant information is available',
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
          id: string
          title: string
          instances: {
            id: string
            startDate: string
            startDateTimeDuration?: {
              startTime?: string
              endTime?: string
            }
          }[]
        }
      }>(authorization, GET_COURSE_BY_ID_QUERY, {
        input: {
          id: courseId,
        },
      })
      .then((response) => response.json())

    const course = response.data?.getCourseById
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

  private async extractApplicantInfo(externalData: ExternalData) {
    const applicantName = getValueViaPath<string>(
      externalData,
      'nationalRegistry.data.fullName',
    )
    const applicantEmail = getValueViaPath<string>(
      externalData,
      'userProfile.data.email',
    )
    const applicantPhone = getValueViaPath<string>(
      externalData,
      'userProfile.data.mobilePhoneNumber',
    )

    return {
      applicantName,
      applicantEmail,
      applicantPhone,
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

    message += `Kennitala umsækjanda: ${application.applicant}\n`

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
