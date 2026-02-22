import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import format from 'date-fns/format'
import {
  ApplicationTypes,
  type ApplicationWithAttachments,
} from '@island.is/application/types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { YesOrNoEnum, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { ZendeskService } from '@island.is/clients/zendesk'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type { ApplicationAnswers } from './types'
import { HHCoursesConfig } from './courses.config'

const GET_COURSE_BY_ID_QUERY = `
  query GetCourseById($input: GetCourseByIdInput!) {
    getCourseById(input: $input) {
      course {
        id
        title
        courseListPageId
        instances {
          id
          startDate
          startDateTimeDuration {
            startTime
            endTime
          }
          maxRegistrations
          chargeItemCode
          location
        }
      }
    }
  }
`

const COURSE_LIST_PAGE_SLUG_MAP: Record<string, string> = {
  '6pkONOn80xzGTGij6qtjai': 'namskeid-fyrir-almenning',
  '147YftiWFQsBcbUFFe2rj1': 'namskeid-fyrir-fagfolk',
}

@Injectable()
export class CoursesService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateApiService: SharedTemplateApiService,
    private readonly zendeskService: ZendeskService,
    private readonly applicationApiService: ApplicationApiService,
    @Inject(HHCoursesConfig.KEY)
    private readonly coursesConfig: ConfigType<typeof HHCoursesConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID)
  }

  async getSelectedChargeItem({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    chargeItemCode?: string | null
    courseTitle?: string | null
  }> {
    const courseId = getValueViaPath<ApplicationAnswers['courseSelect']>(
      application.answers,
      'courseSelect',
    )
    const courseInstanceId = getValueViaPath<ApplicationAnswers['dateSelect']>(
      application.answers,
      'dateSelect',
    )

    if (!courseId || !courseInstanceId)
      return { chargeItemCode: null, courseTitle: null }

    const { course, courseInstance } = await this.getCourseById(
      courseId,
      courseInstanceId,
      auth.authorization,
    )

    return {
      chargeItemCode: courseInstance.chargeItemCode,
      courseTitle: course.title,
    }
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

      if (!name || !email || !phone || !nationalId)
        throw new TemplateApiError(
          {
            title: 'No contact information found',
            summary: 'No contact information found',
          },
          400,
        )

      const courseUrl = this.getCourseUrl(course.id, course.courseListPageId)

      const message = await this.formatApplicationMessage(
        application,
        participantList,
        course.title,
        courseUrl,
        courseInstance,
        nationalId,
        name,
        email,
        phone,
        healthcenter,
      )

      await this.sharedTemplateApiService.sendEmail(
        (_props) => ({
          to: this.coursesConfig.applicationRecipientEmail,
          from: {
            name: this.coursesConfig.applicationSenderName,
            address: this.coursesConfig.applicationSenderEmail,
          },
          subject: `${this.coursesConfig.applicationEmailSubject} - ${courseInstance.id}`,
          text: message,
          replyTo: email,
        }),
        application,
      )

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

  async checkParticipantAvailability({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    slotsAvailable?: number
    hasAvailability: boolean
  }> {
    const courseId = getValueViaPath<string>(
      application.answers,
      'courseSelect',
    )
    const courseInstanceId = getValueViaPath<string>(
      application.answers,
      'dateSelect',
    )

    const participantList =
      getValueViaPath<ApplicationAnswers['participantList']>(
        application.answers,
        'participantList',
      ) ?? []

    if (!courseId || !courseInstanceId || !participantList.length) {
      throw new TemplateApiError(
        {
          title: 'Course id or course instance id not provided',
          summary: 'Course id or course instance id not provided',
        },
        400,
      )
    }

    const { courseInstance } = await this.getCourseById(
      courseId,
      courseInstanceId,
      auth.authorization,
    )

    const maxRegistrations = courseInstance.maxRegistrations ?? 0

    if (maxRegistrations <= 0) {
      return { hasAvailability: true }
    }

    const [zendeskNationalIds, paymentNationalIds] = await Promise.all([
      this.getZendeskParticipantNationalIds(courseInstance.id),
      this.getPaymentStateParticipantNationalIds(
        courseInstance.id,
        application.id,
      ),
    ])

    const currentApplicationParticipantNationalIds = new Set(
      participantList.map((p) => p.nationalIdWithName.nationalId),
    )

    const nationalIdsTakenByOtherApplications = new Set([
      ...zendeskNationalIds,
      ...paymentNationalIds,
    ])
    const allNationalIds = new Set([
      ...currentApplicationParticipantNationalIds,
      ...nationalIdsTakenByOtherApplications,
    ])

    return {
      slotsAvailable: Math.max(
        0,
        maxRegistrations - nationalIdsTakenByOtherApplications.size,
      ),
      hasAvailability: maxRegistrations >= allNationalIds.size,
    }
  }

  private async getZendeskParticipantNationalIds(
    courseInstanceId: string,
  ): Promise<Set<string>> {
    const subject = `${this.coursesConfig.applicationEmailSubject} - ${courseInstanceId}`
    const query = `type:ticket subject:"${subject}"`
    let tickets
    try {
      tickets = await this.zendeskService.searchTickets(query)
    } catch (error) {
      this.logger.warn(
        'Failed to search Zendesk tickets for participant availability check',
        { error: error.message },
      )
      throw new TemplateApiError(
        {
          title:
            'Failed to search Zendesk tickets for participant availability check',
          summary: error.message,
        },
        500,
      )
    }

    const nationalIds = new Set<string>()
    for (const ticket of tickets) {
      if (!ticket.description) continue
      const matches = ticket.description.matchAll(
        /Kennitala þátttakanda \d+: (\d{10})/g,
      )
      for (const match of matches) nationalIds.add(match[1])
    }

    return nationalIds
  }

  private async getPaymentStateParticipantNationalIds(
    courseInstanceId: string,
    excludeApplicationId: string,
  ): Promise<Set<string>> {
    try {
      const findQuery = this.applicationApiService.customTemplateFindQuery(
        ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID,
      )
      const applications = await findQuery({
        state: 'payment',
        'answers.dateSelect': courseInstanceId,
      })

      const nationalIds = new Set<string>()
      for (const app of applications) {
        if (app.id === excludeApplicationId) continue
        const participantList = (app.answers as Record<string, unknown>)
          ?.participantList
        if (!Array.isArray(participantList)) continue
        for (const p of participantList) {
          const nid = p?.nationalIdWithName?.nationalId
          if (typeof nid === 'string' && nid) {
            nationalIds.add(nid)
          }
        }
      }

      return nationalIds
    } catch (error) {
      this.logger.warn(
        'Failed to query payment-state applications for participant availability check',
        { error: error.message },
      )
      throw new TemplateApiError(
        {
          title:
            'Failed to query payment-state applications for participant availability check',
          summary: error.message,
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
            courseListPageId?: string | null
            instances: {
              id: string
              startDate: string
              startDateTimeDuration?: {
                startTime?: string
                endTime?: string
              }
              maxRegistrations?: number
              chargeItemCode?: string | null
            }[]
          }
        }
      }>(authorization, GET_COURSE_BY_ID_QUERY, {
        input: {
          id: courseId,
        },
      })
      .then((r) => r.json())

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

  private getCourseUrl(
    courseId: string,
    courseListPageId?: string | null,
  ): string | null {
    if (!courseListPageId) return null

    const slug = COURSE_LIST_PAGE_SLUG_MAP[courseListPageId]
    if (!slug) return null

    return `https://island.is/s/hh/${slug}/${courseId}`
  }

  private async formatApplicationMessage(
    application: ApplicationWithAttachments,
    participantList: ApplicationAnswers['participantList'],
    courseTitle: string,
    courseUrl: string | null,
    courseInstance: {
      id: string
      startDate: string
      startDateTimeDuration?: {
        startTime?: string
        endTime?: string
      }
      location?: string | null
    },
    nationalId: string,
    name: string,
    email: string,
    phone: string,
    healthcenter?: string,
  ): Promise<string> {
    const courseHasChargeItemCode = getValueViaPath<boolean>(
      application.answers,
      'courseHasChargeItemCode',
      false,
    )
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
    message += `Námskeið: ${courseTitle}\n`
    if (courseUrl) message += `Slóð námskeiðs: ${courseUrl}\n`
    let startDateTimeDuration = ''
    if (courseInstance.startDateTimeDuration?.startTime) {
      startDateTimeDuration = courseInstance.startDateTimeDuration.startTime
      if (courseInstance.startDateTimeDuration.endTime) {
        startDateTimeDuration += ` - ${courseInstance.startDateTimeDuration.endTime}`
      }
    }

    message += `Upphafsdagsetning námskeiðs: ${format(
      new Date(courseInstance.startDate.split('T')[0]),
      'dd.MM.yyyy',
    )} ${startDateTimeDuration ?? ''}\n`
    message += `Staðsetning námskeiðs: ${courseInstance.location ?? ''}\n`

    message += `Kennitala umsækjanda: ${nationalId}\n`
    message += `Nafn umsækjanda: ${name}\n`
    message += `Netfang umsækjanda: ${email}\n`
    message += `Símanúmer umsækjanda: ${phone}\n`
    message += `Heilsugæslustöð umsækjanda: ${healthcenter ?? ''}\n`

    if (courseHasChargeItemCode) {
      const payer =
        userIsPayingAsIndividual === YesOrNoEnum.YES
          ? {
              name: 'Umsækjandi (einstaklingsgreiðsla)',
              nationalId: application.applicant,
            }
          : companyPayment?.nationalIdWithName

      message += `Greiðandi: ${payer?.name ?? ''}\n`
      message += `Kennitala greiðanda: ${payer?.nationalId ?? ''}\n`
    }

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
