import { mock, type MockProxy } from 'jest-mock-extended'
import type { ConfigType } from '@nestjs/config'
import type { Logger } from '@island.is/logging'
import type { ZendeskService } from '@island.is/clients/zendesk'
import type { ApplicationService as ApplicationApiService } from '@island.is/application/api/core'
import { TemplateApiError } from '@island.is/nest/problem'
import type { SharedTemplateApiService } from '../../../shared'
import type { TemplateApiModuleActionProps } from '../../../../types'
import { CoursesService } from './courses.service'
import type { HHCoursesConfig } from './courses.config'
import {
  ZENDESK_CUSTOM_OBJECT_KEYS,
  ZENDESK_PARTICIPANT_TICKET_TAG,
  ZENDESK_TICKET_IDS,
} from './constants'

const APPLICANT_NATIONAL_ID = '0101302989'
const OTHER_NATIONAL_ID = '0101303019'

const course = {
  id: 'course-1',
  title: 'Skyndihjálp',
  courseListPageId: null,
  instances: [
    {
      id: 'instance-1',
      startDate: '2026-10-01T00:00:00',
      maxRegistrations: 10,
      chargeItemCode: null,
      location: 'Reykjavík',
    },
  ],
}

const participant = (nationalId: string, name: string) => ({
  nationalIdWithName: {
    nationalId,
    name,
    email: `${nationalId}@example.com`,
    phone: '5555555',
  },
})

const createProps = (
  participantList = [
    participant(APPLICANT_NATIONAL_ID, 'Umsækjandi'),
    participant(OTHER_NATIONAL_ID, 'Annar'),
  ],
) =>
  ({
    application: {
      id: 'app-1',
      applicant: APPLICANT_NATIONAL_ID,
      answers: {
        courseSelect: 'course-1',
        dateSelect: 'instance-1',
        participantList,
        userInformation: { email: 'applicant@example.com', phone: '5555555' },
      },
      externalData: {
        nationalRegistry: { data: { fullName: 'Umsækjandi' } },
      },
    },
    auth: { authorization: 'Bearer token' },
  } as unknown as TemplateApiModuleActionProps)

const externalId = (nationalId: string) => `dev-app-1-${nationalId}`

describe('CoursesService', () => {
  let service: CoursesService
  let zendesk: MockProxy<ZendeskService>

  beforeEach(() => {
    zendesk = mock<ZendeskService>()
    const shared = mock<SharedTemplateApiService>()
    shared.makeGraphqlQuery.mockImplementation(
      async (_auth, query) =>
        ({
          json: async () =>
            query.includes('getCourseById')
              ? { data: { getCourseById: { course } } }
              : { data: { getChargeItemCodesByCourseId: { items: [] } } },
        } as unknown as Response),
    )

    const applicationApi = mock<ApplicationApiService>()
    applicationApi.customTemplateFindQuery.mockReturnValue(async () => [])

    service = new CoursesService(
      shared,
      zendesk,
      applicationApi,
      {
        applicationSenderName: 'HH',
        applicationSenderEmail: 'hh@example.com',
        applicationEmailSubject: 'Skráning',
        zendeskEnvTag: 'hh_env_dev',
      } as ConfigType<typeof HHCoursesConfig>,
      mock<Logger>(),
    )

    zendesk.upsertCustomObjectRecord.mockImplementation(
      async (key, record) => ({
        id: `${key}-record`,
        name: record.name,
        external_id: record.external_id,
      }),
    )
    zendesk.listCustomObjectRecordsByExternalIds.mockImplementation(
      async (_key, externalIds) =>
        externalIds.map((id) => ({ id, name: id, external_id: id })),
    )
    zendesk.getTicketByExternalId.mockResolvedValue(null)
    zendesk.createManyTickets.mockImplementation(async (inputs) =>
      inputs.map((_input, index) => 100 + index),
    )
  })

  describe('submitApplication', () => {
    it('writes every participant and gives the registrant a single ticket', async () => {
      await expect(service.submitApplication(createProps())).resolves.toEqual({
        success: true,
      })

      const [key, records] =
        zendesk.upsertCustomObjectRecordsByExternalId.mock.calls[0]
      expect(key).toBe(ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant)
      expect(records.map((r) => r.external_id)).toEqual([
        externalId(APPLICANT_NATIONAL_ID),
        externalId(OTHER_NATIONAL_ID),
      ])
      expect(records[0].custom_object_fields).toMatchObject({
        registration_id: 'app-1',
        course_instance: `${ZENDESK_CUSTOM_OBJECT_KEYS.courseInstance}-record`,
      })

      // The applicant is also a participant, but only gets the registrant ticket
      const [tickets] = zendesk.createManyTickets.mock.calls[0]
      expect(tickets.map((t) => t.externalId)).toEqual([
        'dev-app-1-registrant',
        externalId(OTHER_NATIONAL_ID),
      ])
      expect(tickets[0].requester?.email).toBe('applicant@example.com')
      expect(tickets[0].message).toContain('Nafn þátttakanda 2: Annar')
      expect(tickets[1].requester?.email).toBe(
        `${OTHER_NATIONAL_ID}@example.com`,
      )
      expect(tickets[1].tags).toContain(ZENDESK_PARTICIPANT_TICKET_TAG)
      expect(tickets[1].customFields).toEqual(
        expect.arrayContaining([
          {
            id: ZENDESK_TICKET_IDS.customFields.phone,
            value: '5555555',
          },
          {
            id: ZENDESK_TICKET_IDS.customFields.email,
            value: `${OTHER_NATIONAL_ID}@example.com`,
          },
        ]),
      )
      expect(tickets[1].message).toContain('Skráð af: Umsækjandi')

      // Each participant record is linked to its ticket
      const links = zendesk.upsertCustomObjectRecord.mock.calls
        .filter(([key]) => key === ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant)
        .map(([, record]) => [
          record.external_id,
          record.custom_object_fields?.ticket_id,
        ])
      expect(links).toEqual(
        expect.arrayContaining([
          [externalId(APPLICANT_NATIONAL_ID), 100],
          [externalId(OTHER_NATIONAL_ID), 101],
        ]),
      )
      expect(
        zendesk.deleteCustomObjectRecordsByExternalId,
      ).not.toHaveBeenCalled()
    })

    it('gives the registrant a ticket when they are not a participant', async () => {
      await service.submitApplication(
        createProps([participant(OTHER_NATIONAL_ID, 'Annar')]),
      )

      const [tickets] = zendesk.createManyTickets.mock.calls[0]
      expect(tickets.map((t) => t.externalId)).toEqual([
        'dev-app-1-registrant',
        externalId(OTHER_NATIONAL_ID),
      ])
    })

    it('rolls back every participant and creates no tickets when the bulk job fails', async () => {
      zendesk.upsertCustomObjectRecordsByExternalId.mockRejectedValue(
        new Error('1 Zendesk custom object job item(s) failed'),
      )

      await expect(service.submitApplication(createProps())).rejects.toThrow(
        TemplateApiError,
      )

      expect(
        zendesk.deleteCustomObjectRecordsByExternalId,
      ).toHaveBeenCalledWith(ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant, [
        externalId(APPLICANT_NATIONAL_ID),
        externalId(OTHER_NATIONAL_ID),
      ])
      expect(zendesk.createManyTickets).not.toHaveBeenCalled()
    })

    it('rolls back when a participant is missing after the bulk job', async () => {
      zendesk.listCustomObjectRecordsByExternalIds.mockImplementation(
        async (_key, externalIds) =>
          externalIds.slice(1).map((id) => ({ id, name: id, external_id: id })),
      )

      await expect(service.submitApplication(createProps())).rejects.toThrow(
        TemplateApiError,
      )

      expect(zendesk.deleteCustomObjectRecordsByExternalId).toHaveBeenCalled()
      expect(zendesk.createManyTickets).not.toHaveBeenCalled()
    })

    it('still fails the submission when the rollback fails', async () => {
      zendesk.upsertCustomObjectRecordsByExternalId.mockRejectedValue(
        new Error('job failed'),
      )
      zendesk.deleteCustomObjectRecordsByExternalId.mockRejectedValue(
        new Error('delete failed'),
      )

      await expect(service.submitApplication(createProps())).rejects.toThrow(
        TemplateApiError,
      )
      expect(zendesk.createManyTickets).not.toHaveBeenCalled()
    })

    it('does not create duplicate tickets when retried', async () => {
      // The previous attempt linked the applicant, and created the other
      // participant's ticket without linking it
      zendesk.listCustomObjectRecordsByExternalIds.mockImplementation(
        async (_key, externalIds) =>
          externalIds.map((id) => ({
            id,
            name: id,
            external_id: id,
            custom_object_fields:
              id === externalId(APPLICANT_NATIONAL_ID)
                ? { ticket_id: '100' }
                : {},
          })),
      )
      zendesk.getTicketByExternalId.mockImplementation(async (id) =>
        id === externalId(OTHER_NATIONAL_ID) ? ({ id: '101' } as never) : null,
      )

      await service.submitApplication(createProps())

      expect(zendesk.getTicketByExternalId).toHaveBeenCalledTimes(1)
      expect(zendesk.createManyTickets).not.toHaveBeenCalled()
      const links = zendesk.upsertCustomObjectRecord.mock.calls.filter(
        ([key]) => key === ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
      )
      expect(links).toHaveLength(1)
      expect(links[0][1]).toMatchObject({
        external_id: externalId(OTHER_NATIONAL_ID),
        custom_object_fields: { ticket_id: 101 },
      })
    })

    it('keeps the participants and links created tickets when some tickets fail', async () => {
      zendesk.createManyTickets.mockResolvedValue([100, undefined])

      await expect(service.submitApplication(createProps())).rejects.toThrow(
        TemplateApiError,
      )

      expect(
        zendesk.deleteCustomObjectRecordsByExternalId,
      ).not.toHaveBeenCalled()
      const links = zendesk.upsertCustomObjectRecord.mock.calls.filter(
        ([key]) => key === ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
      )
      expect(links.map(([, record]) => record.external_id)).toEqual([
        externalId(APPLICANT_NATIONAL_ID),
      ])
    })

    it('rejects duplicate participants before writing anything', async () => {
      await expect(
        service.submitApplication(
          createProps([
            participant(OTHER_NATIONAL_ID, 'Annar'),
            participant(OTHER_NATIONAL_ID, 'Annar'),
          ]),
        ),
      ).rejects.toThrow(TemplateApiError)

      expect(zendesk.upsertCustomObjectRecord).not.toHaveBeenCalled()
      expect(
        zendesk.upsertCustomObjectRecordsByExternalId,
      ).not.toHaveBeenCalled()
    })

    it('rejects more participants than fit in a single bulk job', async () => {
      const participants = Array.from({ length: 93 }, (_, i) =>
        participant(`${1000000000 + i}`, `Þátttakandi ${i}`),
      )

      await expect(
        service.submitApplication(createProps(participants)),
      ).rejects.toThrow(TemplateApiError)

      expect(
        zendesk.upsertCustomObjectRecordsByExternalId,
      ).not.toHaveBeenCalled()
    })
  })

  describe('checkParticipantAvailability', () => {
    it('counts the participant records of the course instance', async () => {
      zendesk.searchCustomObjectRecords.mockResolvedValue([
        {
          id: '1',
          name: 'a',
          external_id: 'a',
          custom_object_fields: { kennitala: '1' },
        },
        {
          id: '2',
          name: 'b',
          external_id: 'b',
          custom_object_fields: { kennitala: '2' },
        },
        // Registered twice through different applications
        {
          id: '3',
          name: 'b',
          external_id: 'c',
          custom_object_fields: { kennitala: '2' },
        },
      ])

      const result = await service.checkParticipantAvailability(createProps())

      expect(zendesk.listCustomObjectRecordsByExternalIds).toHaveBeenCalledWith(
        ZENDESK_CUSTOM_OBJECT_KEYS.courseInstance,
        ['dev-instance-1'],
      )
      expect(zendesk.searchCustomObjectRecords).toHaveBeenCalledWith(
        ZENDESK_CUSTOM_OBJECT_KEYS.courseParticipant,
        { 'custom_object_fields.course_instance': { $eq: 'dev-instance-1' } },
      )
      expect(result).toEqual({ slotsAvailable: 8, hasAvailability: true })
    })

    it('counts nobody when the course instance has no record yet', async () => {
      zendesk.listCustomObjectRecordsByExternalIds.mockResolvedValue([])

      const result = await service.checkParticipantAvailability(createProps())

      expect(zendesk.searchCustomObjectRecords).not.toHaveBeenCalled()
      expect(result).toEqual({ slotsAvailable: 10, hasAvailability: true })
    })
  })
})
