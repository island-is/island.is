import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ZendeskService } from '@island.is/clients/zendesk'
import { YesOrNoEnum } from '@island.is/application/core'
import { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'

type NationalIdWithName = {
  nationalId: string
  name: string
  email: string
  phone: string
}

type ApplicationAnswers = {
  userIsPayingAsIndividual: YesOrNoEnum
  participantList: Array<{
    nationalIdWithName: NationalIdWithName
  }>
  courseSelect: string
  dateSelect: string
  companyPayment?: {
    nationalIdWithName: NationalIdWithName
  }
}

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
    super(ApplicationTypes.HH_COURSES)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    try {
      const answers = application.answers as ApplicationAnswers

      const courseResponse = await this.sharedTemplateApiService
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
        }>(auth.authorization, GET_COURSE_BY_ID_QUERY, {
          input: {
            id: answers.courseSelect,
          },
        })
        .then((response) => response.json())

      if (!courseResponse.data?.getCourseById?.id) {
        throw new TemplateApiError(
          {
            title: 'Course not found',
            summary: 'Course not found',
          },
          404,
        )
      }

      const courseInstance = courseResponse.data.getCourseById.instances.find(
        (instance) => instance.id === answers.dateSelect,
      )

      if (!courseInstance || !answers.dateSelect) {
        throw new TemplateApiError(
          {
            title: 'Course instance not found',
            summary: 'Course instance not found',
          },
          404,
        )
      }

      // Use the first participant for the Zendesk ticket requester
      const firstParticipant = answers.participantList[0]?.nationalIdWithName
      if (!firstParticipant) {
        throw new Error('No participants found in application')
      }

      const name = firstParticipant.name
      const email = firstParticipant.email
      const phone = firstParticipant.phone

      let user = await this.zendeskService.getUserByEmail(email)

      if (!user) {
        user = await this.zendeskService.createUser(name, email, phone)
      }

      const message = await this.formatApplicationMessage(
        answers,
        application,
        courseResponse.data.getCourseById.id,
        courseResponse.data.getCourseById.title,
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

  private async formatApplicationMessage(
    answers: ApplicationAnswers,
    application: ApplicationWithAttachments,
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
    let message = ''
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

    message += `Upphafsdagsetning: ${courseInstance.startDate} ${
      startDateTimeDuration ?? ''
    }\n`

    message += `Kennitala umsækjanda: ${application.applicant}\n`

    const payer =
      answers.userIsPayingAsIndividual === YesOrNoEnum.YES
        ? {
            name: 'Umsækjandi (einstaklingsgreiðsla)',
            nationalId: application.applicant,
          }
        : answers.companyPayment?.nationalIdWithName

    message += `Nafn greiðanda: ${payer?.name ?? ''}\n`
    message += `Kennitala greiðanda: ${payer?.nationalId ?? ''}\n`

    answers.participantList.forEach((participant, index) => {
      const p = participant.nationalIdWithName
      message += `Nafn þátttakanda ${index + 1}: ${p.name}\n`
      message += `Kennitala þátttakanda ${index + 1}: ${p.nationalId}\n`
      message += `Netfang þátttakanda ${index + 1}: ${p.email}\n`
      message += `Símanúmer þátttakanda ${index + 1}: ${p.phone}\n`
    })

    return message
  }
}
