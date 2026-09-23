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
import chunk from 'lodash/chunk'
import {
  type CustomObjectJobItem,
  type SubmitTicketInput,
  ZendeskService,
} from '@island.is/clients/zendesk'
import { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import type { ApplicationAnswers } from './types'
import { HHCoursesConfig } from './courses.config'
import {
  COURSE_LIST_PAGE_SLUG_MAP,
  GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY,
  GET_COURSE_BY_ID_QUERY,
  MAX_PARTICIPANTS_PER_APPLICATION,
  ZENDESK_CUSTOM_OBJECT_KEYS,
  ZENDESK_PARTICIPANT_TICKET_TAG,
  ZENDESK_TICKET_IDS,
} from './constants'

const TICKET_LOOKUP_CONCURRENCY = 10

type CourseInstance = {
  id: string
  displayedTitle?: string | null
  startDate: string
  startDateTimeDuration?: { startTime?: string; endTime?: string }
  description?: string | null
  location?: string | null
  chargeItemCode?: string | null
}

type RegisteredParticipant = {
  participant: ApplicationAnswers['participantList'][number]
  isApplicant: boolean
  record: CustomObjectJobItem
  ticketId?: number
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

      this.validateParticipantList(participantList)

      const {
        name,
        email,
        phone,
        healthcenter,
        nationalId,
        workplace,
        jobTitle,
      } = await this.extractApplicantInfo(application)

      if (!name || !email || !phone || !nationalId)
        throw new TemplateApiError(
          {
            title: 'Vantar tengiliðaupplýsingar',
            summary: 'Vantar tengiliðaupplýsingar',
          },
          400,
        )

      const courseUrl = this.getCourseUrl(course.id, course.courseListPageId)

      // The participant records are the source of truth for registrations, so
      // they are written first and all or nothing. Tickets are only created
      // once the registration is in place and are never rolled back.
      const participants = await this.writeParticipants(
        application.id,
        course,
        courseInstance,
        participantList,
        courseUrl,
        { nationalId, healthcenter },
        auth.authorization,
      )

      const registrantMessage = await this.formatApplicationMessage(
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
        workplace,
        jobTitle,
      )

      await this.ensureTickets(
        application.id,
        course,
        courseInstance,
        courseUrl,
        participants,
        { name, email, message: registrantMessage },
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

  /**
   * Participant records in Zendesk are the source of truth for who is
   * registered, participants are added and removed there by staff.
   */
  private async getZendeskParticipantNationalIds(
    courseInstanceId: string,
  ): Promise<Set<string>> {
    const { externalIdPrefix } = this.getZendeskEnvPrefixes()

    try {
      const [instanceRecord] =
        await this.zendeskService.listCustomObjectRecordsByExternalIds(
          ZENDESK_CUSTOM_OBJECT_KEYS.courseInstance,
          [`${externalIdPrefix}${courseInstanceId}`],
        )

      if (!instanceRecord) return new Set()

      const participants = await this.zendeskService.searchCustomObjectRecords(
        ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
        {
          'custom_object_fields.course_instance': { $eq: instanceRecord.id },
        },
      )

      const nationalIds = new Set<string>()
      for (const participant of participants) {
        const nationalId = participant.custom_object_fields?.kennitala
        if (typeof nationalId === 'string' && nationalId)
          nationalIds.add(nationalId)
      }

      return nationalIds
    } catch (error) {
      this.logger.warn(
        'Failed to look up Zendesk participants for participant availability check',
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
              location?: string | null
              description?: string | null
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

  private validateParticipantList(
    participantList: ApplicationAnswers['participantList'],
  ) {
    const nationalIds = participantList.map(
      (p) => p.nationalIdWithName.nationalId,
    )

    if (
      participantList.length === 0 ||
      participantList.length > MAX_PARTICIPANTS_PER_APPLICATION ||
      new Set(nationalIds).size !== nationalIds.length
    ) {
      throw new TemplateApiError(
        {
          title: 'Ógildur þátttakendalisti',
          summary: 'Ógildur þátttakendalisti',
        },
        400,
      )
    }
  }

  /**
   * Writes every participant of the application as a custom object record.
   * Zendesk has no atomic multi record write, so if anything goes wrong the
   * records that were written are deleted again before throwing. The external
   * ids are deterministic per application, so retrying is always safe.
   */
  private async writeParticipants(
    applicationId: string,
    course: { id: string; title: string },
    courseInstance: CourseInstance,
    participantList: ApplicationAnswers['participantList'],
    courseUrl: string | null,
    applicant: { nationalId: string; healthcenter?: string },
    authorization: string,
  ): Promise<RegisteredParticipant[]> {
    let priceAmount: number | undefined
    try {
      const chargeItemsResponse = await this.sharedTemplateApiService
        .makeGraphqlQuery<{
          getChargeItemCodesByCourseId: {
            items: Array<{ code: string; priceAmount: number }>
          }
        }>(authorization, GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY, {
          input: { courseId: course.id },
        })
        .then((r) => r.json())

      priceAmount =
        chargeItemsResponse.data?.getChargeItemCodesByCourseId?.items?.find(
          (item) => item.code === courseInstance.chargeItemCode,
        )?.priceAmount
    } catch (error) {
      this.logger.error(
        'Failed to fetch charge item codes for course, proceeding without price',
        { error, courseId: course.id },
      )
    }

    const { externalIdPrefix, namePrefix } = this.getZendeskEnvPrefixes()
    const courseExternalId = `${externalIdPrefix}${course.id}`
    const instanceExternalId = `${externalIdPrefix}${courseInstance.id}`

    const courseRecord = await this.zendeskService.upsertCustomObjectRecord(
      ZENDESK_CUSTOM_OBJECT_KEYS.course,
      { name: `${namePrefix}${course.title}`, external_id: courseExternalId },
    )

    const instanceRecord = await this.zendeskService.upsertCustomObjectRecord(
      ZENDESK_CUSTOM_OBJECT_KEYS.courseInstance,
      {
        name: `${namePrefix}${courseInstance.displayedTitle ?? course.title}`,
        external_id: instanceExternalId,
        custom_object_fields: {
          course_start_date: courseInstance.startDate.split('T')[0],
          course_start_time: this.formatCourseInstanceTimeRange(courseInstance),
          course_description: courseInstance.description ?? '',
          ...(priceAmount !== undefined && { course_price: priceAmount }),
          course_location: courseInstance.location ?? '',
          course_url: courseUrl ?? '',
          course_id: courseRecord.id,
          course: courseRecord.id,
        },
      },
    )

    const registrationTime = format(new Date(), 'dd.MM.yyyy HH:mm')

    const participants: RegisteredParticipant[] = participantList.map((p) => {
      const participantPhone = p.nationalIdWithName.phone?.trim()
      const participantWorkplace = p.workplace?.trim()
      const participantTitle = p.jobTitle?.trim()
      const isApplicant =
        p.nationalIdWithName.nationalId === applicant.nationalId
      // Healthcenter is only collected for the applicant
      const participantClinic = isApplicant
        ? applicant.healthcenter?.trim()
        : undefined

      return {
        participant: p,
        isApplicant,
        record: {
          name: p.nationalIdWithName.name,
          external_id: `${externalIdPrefix}${applicationId}-${p.nationalIdWithName.nationalId}`,
          custom_object_fields: {
            kennitala: p.nationalIdWithName.nationalId,
            email: p.nationalIdWithName.email,
            ...(participantPhone && { participant_phone: participantPhone }),
            ...(participantWorkplace && {
              participant_workplace: participantWorkplace,
            }),
            ...(participantTitle && { participant_title: participantTitle }),
            ...(participantClinic && { participant_clinic: participantClinic }),
            registration_time: registrationTime,
            registration_id: applicationId,
            course_instance: instanceRecord.id,
          },
        },
      }
    })

    const externalIds = participants.map((p) => p.record.external_id)

    try {
      await this.zendeskService.upsertCustomObjectRecordsByExternalId(
        ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
        participants.map((p) => p.record),
      )

      const writtenRecords =
        await this.zendeskService.listCustomObjectRecordsByExternalIds(
          ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
          externalIds,
        )
      const writtenRecordsByExternalId = new Map(
        writtenRecords.map((record) => [record.external_id, record]),
      )

      for (const participant of participants) {
        const writtenRecord = writtenRecordsByExternalId.get(
          participant.record.external_id,
        )
        if (!writtenRecord) {
          throw new Error(
            `Participant record ${participant.record.external_id} is missing after the upsert job`,
          )
        }
        participant.ticketId = this.toZendeskNumber(
          writtenRecord.custom_object_fields?.ticket_id as string | undefined,
        )
      }
    } catch (error) {
      this.logger.error(
        'Failed to write HH courses participants to Zendesk, rolling back',
        { applicationId, error: error.message },
      )

      try {
        await this.zendeskService.deleteCustomObjectRecordsByExternalId(
          ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
          externalIds,
        )
      } catch (rollbackError) {
        // A retry of the submission upserts the full list again, so the
        // registration ends up complete either way
        this.logger.error(
          'Failed to roll back HH courses participants in Zendesk',
          { applicationId, externalIds, error: rollbackError.message },
        )
      }

      throw error
    }

    return participants
  }

  /**
   * Creates a ticket for the registrant with the full participant list and a
   * ticket for every other participant. Tickets are looked up by external id
   * first so a retry never creates duplicates, and each participant record is
   * linked to its ticket afterwards.
   */
  private async ensureTickets(
    applicationId: string,
    course: { id: string; title: string },
    courseInstance: CourseInstance,
    courseUrl: string | null,
    participants: RegisteredParticipant[],
    registrant: { name: string; email: string; message: string },
  ): Promise<void> {
    const { externalIdPrefix } = this.getZendeskEnvPrefixes()
    const subject = `${this.coursesConfig.applicationEmailSubject} - ${courseInstance.id}`
    const tags = [this.coursesConfig.zendeskEnvTag, courseInstance.id]

    const tickets: Array<{
      input: SubmitTicketInput & { externalId: string }
      participants: RegisteredParticipant[]
      ticketId?: number
    }> = [
      {
        // The registrant does not get a separate participant ticket
        input: {
          externalId: `${externalIdPrefix}${applicationId}-registrant`,
          message: registrant.message,
          subject,
          requester: { name: registrant.name, email: registrant.email },
          brandId: ZENDESK_TICKET_IDS.brandId,
          ticketFormId: ZENDESK_TICKET_IDS.ticketFormId,
          tags,
          customFields: this.getTicketCustomFields(
            course,
            courseInstance,
            courseUrl,
            registrant.name,
          ),
        },
        participants: participants.filter((p) => p.isApplicant),
      },
      ...participants
        .filter((p) => !p.isApplicant)
        .map((p) => ({
          input: {
            externalId: p.record.external_id,
            message: this.formatParticipantMessage(
              p.participant,
              course.title,
              courseUrl,
              courseInstance,
              registrant,
            ),
            subject,
            requester: {
              name: p.participant.nationalIdWithName.name,
              email: p.participant.nationalIdWithName.email,
            },
            brandId: ZENDESK_TICKET_IDS.brandId,
            ticketFormId: ZENDESK_TICKET_IDS.ticketFormId,
            tags: [...tags, ZENDESK_PARTICIPANT_TICKET_TAG],
            customFields: [
              ...this.getTicketCustomFields(
                course,
                courseInstance,
                courseUrl,
                p.participant.nationalIdWithName.name,
              ),
              {
                id: ZENDESK_TICKET_IDS.customFields.phone,
                value: p.participant.nationalIdWithName.phone,
              },
              {
                id: ZENDESK_TICKET_IDS.customFields.email,
                value: p.participant.nationalIdWithName.email,
              },
            ],
          },
          participants: [p],
        })),
    ]

    // Tickets already linked from a previous attempt do not need a lookup
    for (const ticket of tickets) {
      ticket.ticketId = ticket.participants.find((p) => p.ticketId)?.ticketId
    }

    for (const batch of chunk(
      tickets.filter((ticket) => !ticket.ticketId),
      TICKET_LOOKUP_CONCURRENCY,
    )) {
      await Promise.all(
        batch.map(async (ticket) => {
          const existingTicket =
            await this.zendeskService.getTicketByExternalId(
              ticket.input.externalId,
            )
          ticket.ticketId = this.toZendeskNumber(existingTicket?.id)
        }),
      )
    }

    const missingTickets = tickets.filter((ticket) => !ticket.ticketId)
    if (missingTickets.length > 0) {
      const createdTicketIds = await this.zendeskService.createManyTickets(
        missingTickets.map((ticket) => ticket.input),
      )
      missingTickets.forEach((ticket, index) => {
        ticket.ticketId = createdTicketIds[index]
      })
    }

    const participantsToLink = tickets.flatMap((ticket) =>
      ticket.participants
        .filter((p) => ticket.ticketId && p.ticketId !== ticket.ticketId)
        .map((p) => ({ participant: p, ticketId: ticket.ticketId as number })),
    )

    for (const batch of chunk(participantsToLink, TICKET_LOOKUP_CONCURRENCY)) {
      await Promise.all(
        batch.map(async ({ participant, ticketId }) => {
          await this.zendeskService.upsertCustomObjectRecord(
            ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
            {
              ...participant.record,
              custom_object_fields: {
                ...participant.record.custom_object_fields,
                ticket_id: ticketId,
              },
            },
          )
          participant.ticketId = ticketId
        }),
      )
    }

    const failedTickets = tickets.filter((ticket) => !ticket.ticketId)
    if (failedTickets.length > 0) {
      throw new Error(
        `Failed to create ${
          failedTickets.length
        } Zendesk ticket(s): ${failedTickets
          .map((ticket) => ticket.input.externalId)
          .join(', ')}`,
      )
    }
  }

  private getTicketCustomFields(
    course: { title: string },
    courseInstance: CourseInstance,
    courseUrl: string | null,
    name: string,
  ) {
    return [
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
    ]
  }

  /**
   * All environments share the same Zendesk instance, so custom object records
   * created outside of prod are prefixed to keep them apart.
   * Records without a prefix are prod records.
   */
  private getZendeskEnvPrefixes(): {
    externalIdPrefix: string
    namePrefix: string
  } {
    // hh_env_dev -> dev
    const env = this.coursesConfig.zendeskEnvTag.replace(/^hh_env_/, '')

    if (env === 'prod') {
      return { externalIdPrefix: '', namePrefix: '' }
    }

    return {
      externalIdPrefix: `${env}-`,
      namePrefix: `[${env.toUpperCase()}] `,
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
    courseInstance: {
      id: string
      startDate: string
      startDateTimeDuration?: {
        startTime?: string
        endTime?: string
      }
      location?: string | null
      chargeItemCode?: string | null
    },
    nationalId: string,
    name: string,
    email: string,
    phone: string,
    healthcenter?: string,
    workplace?: string,
    jobTitle?: string,
  ): Promise<string> {
    const courseHasChargeItemCode = Boolean(courseInstance.chargeItemCode)
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

    let message = this.formatCourseInfo(courseTitle, courseUrl, courseInstance)

    message += `Kennitala umsækjanda: ${nationalId}\n`
    message += `Nafn umsækjanda: ${name}\n`
    message += `Netfang umsækjanda: ${email}\n`
    message += `Símanúmer umsækjanda: ${phone}\n`
    message += `Heilsugæslustöð umsækjanda: ${healthcenter ?? ''}\n`
    if (workplace) message += `Vinnustaður umsækjanda: ${workplace}\n`
    if (jobTitle) message += `Starfsheiti umsækjanda: ${jobTitle}\n`

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

  private formatParticipantMessage(
    participant: ApplicationAnswers['participantList'][number],
    courseTitle: string,
    courseUrl: string | null,
    courseInstance: CourseInstance,
    registrant: { name: string; email: string },
  ): string {
    const p = participant.nationalIdWithName

    let message = this.formatCourseInfo(courseTitle, courseUrl, courseInstance)
    message += `Nafn þátttakanda: ${p.name}\n`
    message += `Kennitala þátttakanda: ${p.nationalId}\n`
    message += `Netfang þátttakanda: ${p.email}\n`
    message += `Símanúmer þátttakanda: ${p.phone}\n`
    if (participant.workplace)
      message += `Vinnustaður þátttakanda: ${participant.workplace}\n`
    if (participant.jobTitle)
      message += `Starfsheiti þátttakanda: ${participant.jobTitle}\n`
    message += `Skráð af: ${registrant.name} (${registrant.email})\n`

    return message
  }

  private formatCourseInfo(
    courseTitle: string,
    courseUrl: string | null,
    courseInstance: CourseInstance,
  ): string {
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

    return message
  }

  private formatCourseInstanceDate(courseInstance: {
    startDate: string
    displayedTitle?: string | null
    startDateTimeDuration?: {
      startTime?: string
      endTime?: string
    }
  }): string {
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

  private formatCourseInstanceTimeRange(courseInstance: {
    startDateTimeDuration?: {
      startTime?: string
      endTime?: string
    }
  }): string {
    const { startTime, endTime } = courseInstance.startDateTimeDuration ?? {}

    if (!startTime) return ''

    return endTime ? `${startTime} - ${endTime}` : startTime
  }
}
