import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import format from 'date-fns/format'
import icelandicLocale from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import {
  ApplicationTypes,
  type ApplicationWithAttachments,
} from '@island.is/application/types'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { YesOrNoEnum, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { type Ticket, ZendeskService } from '@island.is/clients/zendesk'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type {
  ApplicantInfo,
  ApplicationAnswers,
  CourseData,
  CourseInstanceData,
  Payer,
} from './types'
import { HHCoursesConfig } from './courses.config'
import {
  COURSE_LIST_PAGE_SLUG_MAP,
  GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY,
  GET_COURSE_BY_ID_QUERY,
  ZENDESK_CUSTOM_OBJECT_KEYS,
  ZENDESK_TICKET_IDS,
} from './constants'

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

      const { name, email, phone, nationalId, ...rest } =
        await this.extractApplicantInfo(application)

      if (!name || !email || !phone || !nationalId)
        throw new TemplateApiError(
          {
            title: 'Vantar tengiliðaupplýsingar',
            summary: 'Vantar tengiliðaupplýsingar',
          },
          400,
        )

      const applicant: ApplicantInfo = {
        ...rest,
        name,
        email,
        phone,
        nationalId,
      }

      const courseUrl = this.getCourseUrl(course.id, course.courseListPageId)

      const message = await this.formatApplicationMessage(
        application,
        participantList,
        course.title,
        courseUrl,
        courseInstance,
        applicant,
      )

      const ticket = await this.zendeskService.createTicket({
        message,
        subject: `${this.coursesConfig.applicationEmailSubject} - ${courseInstance.id}`,
        requester: {
          name,
          email,
        },
        brandId: ZENDESK_TICKET_IDS.brandId,
        ticketFormId: ZENDESK_TICKET_IDS.ticketFormId,
        tags: [this.coursesConfig.zendeskEnvTag, courseInstance.id],
        customFields: [
          {
            id: ZENDESK_TICKET_IDS.customFields.courseTitle,
            value: course.title,
          },
          {
            id: ZENDESK_TICKET_IDS.customFields.applicantName,
            value: name,
          },
          {
            id: ZENDESK_TICKET_IDS.customFields.startDate,
            value: this.formatCourseInstanceDate(courseInstance),
          },
          {
            id: ZENDESK_TICKET_IDS.customFields.location,
            value: courseInstance.location ?? '',
          },
          {
            id: ZENDESK_TICKET_IDS.customFields.courseUrl,
            value: courseUrl ?? '',
          },
        ],
      })

      try {
        await this.submitCustomObjects({
          application,
          course,
          courseInstance,
          participantList,
          applicant,
          ticketId: ticket?.id,
          courseUrl,
          authorization: auth.authorization,
        })
      } catch (error) {
        this.logger.error(
          'Failed to submit HH courses application to Zendesk custom objects',
          { applicationId: application.id, error: error.message },
        )
      }

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
          title: 'Villa kom upp við að senda umsókn',
          summary: 'Villa kom upp við að senda umsókn',
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
          title: 'Skráningarupplýsingar vantar',
          summary: 'Skráningarupplýsingar vantar',
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

    const hasAvailability = maxRegistrations >= allNationalIds.size

    const slotsAvailable = Math.max(
      0,
      maxRegistrations - nationalIdsTakenByOtherApplications.size,
    )

    return {
      slotsAvailable,
      hasAvailability,
    }
  }

  private async getZendeskParticipantNationalIds(
    courseInstanceId: string,
  ): Promise<Set<string>> {
    const subject = `${this.coursesConfig.applicationEmailSubject} - ${courseInstanceId}`
    const backwardsCompatibleQuery = `type:ticket subject:"${subject}"`
    const newQuery = `type:ticket tags:"${this.coursesConfig.zendeskEnvTag} ${courseInstanceId}"`
    const tickets: Ticket[] = []
    try {
      const [backwardsCompatibleTickets, newTickets] = await Promise.all([
        this.zendeskService.searchTickets(backwardsCompatibleQuery),
        this.zendeskService.searchTickets(newQuery),
      ])

      const ticketMap = new Map<string, Ticket>()
      for (const ticket of backwardsCompatibleTickets)
        ticketMap.set(ticket.id, ticket)
      for (const ticket of newTickets) ticketMap.set(ticket.id, ticket)
      for (const ticket of ticketMap.values()) tickets.push(ticket)
    } catch (error) {
      this.logger.warn(
        'Failed to search Zendesk tickets for participant availability check',
        { error: error.message },
      )
      throw new TemplateApiError(
        {
          title: 'Villa kom upp við að fletta upp skráningarfjölda',
          summary: 'Ekki tókst að fletta upp skráningarfjölda',
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
          title: 'Villa kom upp við að fletta upp skráningarfjölda',
          summary: 'Ekki tókst að fletta upp skráningarfjölda',
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
          title: 'Vantar upplýsingar um námskeið',
          summary: 'Vantar upplýsingar um námskeið',
        },
        400,
      )
    if (!courseInstanceId)
      throw new TemplateApiError(
        {
          title: 'Vantar upplýsingar um námskeiðsdagsetningu',
          summary: 'Vantar upplýsingar um námskeiðsdagsetningu',
        },
        400,
      )

    const response = await this.sharedTemplateApiService
      .makeGraphqlQuery<{
        getCourseById: {
          course: CourseData
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
          title: 'Námskeið fannst ekki',
          summary: 'Námskeið fannst ekki',
        },
        404,
      )
    if (!courseInstance)
      throw new TemplateApiError(
        {
          title: 'Námskeiðsdagsetning fannst ekki',
          summary: 'Námskeiðsdagsetning fannst ekki',
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
    const workplace = getValueViaPath<string>(application.answers, 'workplace')
    const jobTitle = getValueViaPath<string>(application.answers, 'jobTitle')

    return {
      nationalId,
      name,
      email,
      phone,
      healthcenter,
      workplace,
      jobTitle,
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

  private async submitCustomObjects({
    application,
    course,
    courseInstance,
    participantList,
    applicant,
    ticketId,
    courseUrl,
    authorization,
  }: {
    application: ApplicationWithAttachments
    course: CourseData
    courseInstance: CourseInstanceData
    participantList: ApplicationAnswers['participantList']
    applicant: ApplicantInfo
    ticketId: string | number | undefined
    courseUrl: string | null
    authorization: string
  }): Promise<void> {
    const priceAmount = await this.getCoursePriceAmount(
      course.id,
      courseInstance.chargeItemCode,
      authorization,
    )

    const numericTicketId = this.toZendeskNumber(ticketId)

    const courseRecord = await this.zendeskService.upsertCustomObjectRecord(
      ZENDESK_CUSTOM_OBJECT_KEYS.course,
      {
        name: course.title,
        external_id: course.id,
        custom_object_fields: {
          course_url: courseUrl ?? '',
          course_slug: course.slug ?? '',
          course_intro: course.intro ?? '',
          course_categories: (course.categories ?? [])
            .map((category) => category.title)
            .join(', '),
          course_organization: course.organizationTitle ?? '',
        },
      },
    )

    const instanceRecord = await this.zendeskService.upsertCustomObjectRecord(
      ZENDESK_CUSTOM_OBJECT_KEYS.courseInstance,
      {
        name: courseInstance.displayedTitle ?? course.title,
        external_id: courseInstance.id,
        custom_object_fields: {
          course_start_date: courseInstance.startDate.split('T')[0],
          course_start_time: this.formatCourseInstanceTimeRange(courseInstance),
          course_description: courseInstance.description ?? '',
          ...(priceAmount !== undefined && { course_price: priceAmount }),
          course_location: courseInstance.location ?? '',
          course_url: courseUrl ?? '',
          course_charge_item_code: courseInstance.chargeItemCode ?? '',
          ...(courseInstance.maxRegistrations != null && {
            course_max_registrations: courseInstance.maxRegistrations,
          }),
          course_id: courseRecord.id,
          course: courseRecord.id,
        },
      },
    )

    const payer = this.resolvePayer(application, courseInstance, applicant)

    const registrationRecord =
      await this.zendeskService.upsertCustomObjectRecord(
        ZENDESK_CUSTOM_OBJECT_KEYS.courseRegistration,
        {
          name: `${applicant.name} - ${
            courseInstance.displayedTitle ?? course.title
          }`,
          external_id: application.id,
          custom_object_fields: {
            application_id: application.id,
            applicant_name: applicant.name,
            applicant_kennitala: applicant.nationalId,
            applicant_email: applicant.email,
            applicant_phone: applicant.phone,
            applicant_healthcenter: applicant.healthcenter ?? '',
            applicant_workplace: applicant.workplace ?? '',
            applicant_job_title: applicant.jobTitle ?? '',
            participant_count: participantList.length,
            course_instance: instanceRecord.id,
            course_instance_external_id: courseInstance.id,
            ...(payer && {
              payer_name: payer.name,
              payer_kennitala: payer.nationalId,
              paid_as_individual: payer.isIndividual,
            }),
            ...(numericTicketId !== undefined && {
              ticket_id: numericTicketId,
            }),
          },
        },
      )

    if (participantList.length === 0) return

    await this.zendeskService.runCustomObjectJob(
      ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
      'create_or_update_by_external_id',
      participantList.map((participant) => {
        const p = participant.nationalIdWithName
        const participantPhone = p.phone?.trim()

        return {
          name: p.name,
          external_id: `${courseInstance.id}-${p.nationalId}`,
          custom_object_fields: {
            kennitala: p.nationalId,
            email: p.email,
            ...(participantPhone && { participant_phone: participantPhone }),
            ...(participant.workplace && { workplace: participant.workplace }),
            ...(participant.jobTitle && { job_title: participant.jobTitle }),
            course_instance: instanceRecord.id,
            course_instance_external_id: courseInstance.id,
            registration: registrationRecord.id,
            ...(numericTicketId !== undefined && {
              ticket_id: numericTicketId,
            }),
          },
        }
      }),
    )
  }

  /**
   * Price of the charge item the course instance is registered against, taken
   * from the performing organisation's FJS catalog. Missing prices are not
   * fatal: the record is written without the field.
   */
  private async getCoursePriceAmount(
    courseId: string,
    chargeItemCode: string | null | undefined,
    authorization: string,
  ): Promise<number | undefined> {
    if (!chargeItemCode) return undefined

    try {
      const chargeItemsResponse = await this.sharedTemplateApiService
        .makeGraphqlQuery<{
          getChargeItemCodesByCourseId: {
            items: Array<{ code: string; priceAmount: number }>
          }
        }>(authorization, GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY, {
          input: { courseId },
        })
        .then((r) => r.json())

      const items =
        chargeItemsResponse.data?.getChargeItemCodesByCourseId?.items ?? []

      return items.find((item) => item.code === chargeItemCode)?.priceAmount
    } catch (error) {
      this.logger.error(
        'Failed to fetch charge item codes for course, proceeding without price',
        { error, courseId },
      )
      return undefined
    }
  }

  /**
   * Who is paying for the registration. Courses without a charge item code are
   * free, so they have no payer at all.
   */
  private resolvePayer(
    application: ApplicationWithAttachments,
    courseInstance: CourseInstanceData,
    applicant: ApplicantInfo,
  ): Payer | null {
    if (!courseInstance.chargeItemCode) return null

    const userIsPayingAsIndividual = getValueViaPath<YesOrNoEnum>(
      application.answers,
      'payment.userIsPayingAsIndividual',
      YesOrNoEnum.YES,
    )

    if (userIsPayingAsIndividual === YesOrNoEnum.YES) {
      return {
        name: applicant.name,
        nationalId: application.applicant,
        isIndividual: true,
      }
    }

    const companyPayment = getValueViaPath<ApplicationAnswers['payment']>(
      application.answers,
      'payment',
    )?.companyPayment

    return {
      name: companyPayment?.nationalIdWithName?.name ?? '',
      nationalId: companyPayment?.nationalIdWithName?.nationalId ?? '',
      isIndividual: false,
    }
  }

  private toZendeskNumber(
    value: string | number | undefined,
  ): number | undefined {
    const parsed = Number(value)

    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
  }

  private async formatApplicationMessage(
    application: ApplicationWithAttachments,
    participantList: ApplicationAnswers['participantList'],
    courseTitle: string,
    courseUrl: string | null,
    courseInstance: CourseInstanceData,
    applicant: ApplicantInfo,
  ): Promise<string> {
    const {
      nationalId,
      name,
      email,
      phone,
      healthcenter,
      workplace,
      jobTitle,
    } = applicant
    const payer = this.resolvePayer(application, courseInstance, applicant)

    let message = ''
    message += `Námskeið: ${courseTitle}\n`
    if (courseUrl) message += `Slóð námskeiðs: ${courseUrl}\n`
    const startDateTimeDuration =
      this.formatCourseInstanceTimeRange(courseInstance)

    message += `Upphafsdagsetning námskeiðs: ${format(
      new Date(courseInstance.startDate.split('T')[0]),
      'dd.MM.yyyy',
    )} ${startDateTimeDuration}\n`
    message += `Staðsetning námskeiðs: ${courseInstance.location ?? ''}\n`

    message += `Kennitala umsækjanda: ${nationalId}\n`
    message += `Nafn umsækjanda: ${name}\n`
    message += `Netfang umsækjanda: ${email}\n`
    message += `Símanúmer umsækjanda: ${phone}\n`
    message += `Heilsugæslustöð umsækjanda: ${healthcenter ?? ''}\n`
    if (workplace) message += `Vinnustaður umsækjanda: ${workplace}\n`
    if (jobTitle) message += `Starfsheiti umsækjanda: ${jobTitle}\n`

    if (payer) {
      message += `Greiðandi: ${
        payer.isIndividual ? 'Umsækjandi (einstaklingsgreiðsla)' : payer.name
      }\n`
      message += `Kennitala greiðanda: ${payer.nationalId}\n`
    }

    participantList.forEach((participant, index) => {
      const p = participant.nationalIdWithName
      message += `Nafn þátttakanda ${index + 1}: ${p.name}\n`
      message += `Kennitala þátttakanda ${index + 1}: ${p.nationalId}\n`
      message += `Netfang þátttakanda ${index + 1}: ${p.email}\n`
      message += `Símanúmer þátttakanda ${index + 1}: ${p.phone}\n`
      if (participant.workplace)
        message += `Vinnustaður þátttakanda ${index + 1}: ${
          participant.workplace
        }\n`
      if (participant.jobTitle)
        message += `Starfsheiti þátttakanda ${index + 1}: ${
          participant.jobTitle
        }\n`
    })

    return message
  }

  private formatCourseInstanceDate(courseInstance: CourseInstanceData): string {
    const ymd = courseInstance.startDate.split('T')[0] ?? ''
    const dateOnly = parseISO(ymd)
    const formattedDate = format(dateOnly, 'd. MMMM yyyy', {
      locale: icelandicLocale,
    })

    const timeRange = this.formatCourseInstanceTimeRange(courseInstance)

    const titleSuffix = courseInstance.displayedTitle?.trim()
      ? courseInstance.displayedTitle.trim()
      : ''

    return [formattedDate, timeRange, titleSuffix]
      .filter((part) => part.length > 0)
      .join(' ')
  }

  private formatCourseInstanceTimeRange(
    courseInstance: Pick<CourseInstanceData, 'startDateTimeDuration'>,
  ): string {
    const { startTime, endTime } = courseInstance.startDateTimeDuration ?? {}

    if (!startTime) return ''

    return endTime ? `${startTime} - ${endTime}` : startTime
  }
}
