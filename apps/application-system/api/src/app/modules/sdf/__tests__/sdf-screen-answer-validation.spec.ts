import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import type { ApplicationWithAttachments } from '@island.is/application/types'
import { createApplicationTemplate } from '@island.is/application/testing'
import { z } from 'zod'

import { SdfScreenService } from '../sdf-screen.service'
import { createLoggerStub } from './logger-stub'

// The service tags the trace with the template's code owner, which needs an
// active span; here the callback just runs.
jest.mock('@island.is/infra-tracing', () => ({
  withCodeOwner: (_codeOwner: unknown, callback: () => unknown) => callback(),
}))

const getApplicationTemplateByTypeIdMock = jest.fn()

jest.mock('@island.is/application/template-loader', () => ({
  getApplicationTemplateByTypeId: (...args: unknown[]) =>
    getApplicationTemplateByTypeIdMock(...args),
}))

const createResolver = () => ({
  resolve: (value: unknown) => (typeof value === 'string' ? value : ''),
  format: (message: unknown) =>
    typeof message === 'string'
      ? message
      : (message as { defaultMessage?: string; id?: string })?.defaultMessage ??
        (message as { id?: string })?.id ??
        '',
})

const dataSchema = z.object({
  applicant: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
  }),
  optionalGroup: z.object({ note: z.string().min(1) }).optional(),
  files: z.array(z.object({ name: z.string() })).optional(),
  count: z.number().optional(),
  // A check that assumes a string, so it throws on another shape.
  weird: z
    .any()
    .refine((value) => value.trim().length > 0)
    .optional(),
})

// Three pages: the applicant's dotted fields, an optional group and a list,
// and a last page with a field the schema does not know.
const form = buildForm({
  id: 'form',
  title: 'Form',
  children: [
    buildSection({
      id: 'section',
      title: 'Section',
      children: [
        buildMultiField({
          id: 'page1',
          title: 'Page 1',
          children: [
            buildTextField({ id: 'applicant.name', title: 'Name' }),
            buildTextField({ id: 'applicant.phone', title: 'Phone' }),
          ],
        }),
        buildMultiField({
          id: 'page2',
          title: 'Page 2',
          children: [
            buildTextField({ id: 'optionalGroup.note', title: 'Note' }),
            buildTextField({ id: 'files', title: 'Files' }),
          ],
        }),
        buildMultiField({
          id: 'page3',
          title: 'Page 3',
          children: [buildTextField({ id: 'comment', title: 'Comment' })],
        }),
      ],
    }),
  ],
})

const template = createApplicationTemplate({
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () => Promise.resolve(form),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: { SUBMIT: { target: 'draft' } },
      },
    },
  },
})

const createApplication = (
  answers: Record<string, unknown> = {},
): ApplicationWithAttachments =>
  ({
    id: '00000000-0000-0000-0000-000000000006',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    applicant: '111111-3000',
    assignees: [],
    applicantActors: [],
    state: 'draft',
    status: ApplicationStatus.DRAFT,
    answers,
    externalData: {},
    attachments: {},
    created: new Date(),
    modified: new Date(),
    name: 'Answer validation app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
  } as unknown as ApplicationWithAttachments)

const buildService = (application: ApplicationWithAttachments) => {
  const logger = createLoggerStub()
  const applicationService = { update: jest.fn() }
  const applicationActionService = {
    performActionOnApplication: jest.fn(),
    changeState: jest
      .fn()
      .mockResolvedValue({ hasError: false, hasChanged: true }),
  }
  const service = new SdfScreenService(
    logger as never,
    applicationService as never,
    {
      findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
    } as never,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
    // Allows every event; the event check has its own tests.
    { validateIncomingEvent: jest.fn() } as never,
  )
  const user = { nationalId: application.applicant } as never
  return { service, applicationService, applicationActionService, user, logger }
}

const errorIds = (screen: {
  page: { errors?: Array<{ componentId: string }> }
}) => (screen.page.errors ?? []).map((error) => error.componentId).sort()

const INVALID_ANSWERS =
  'https://island.is/problems/application-system/sdf/invalid-answers'

describe('SdfScreenService answer validation', () => {
  beforeEach(() => {
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)
  })

  describe('fields inside an object that is missing (NEXT_PAGE)', () => {
    it('reports each required field on the screen', async () => {
      const application = createApplication()
      const { service, applicationService, user } = buildService(application)

      const screen = await service.persistAnswersAndAdvance(
        application.id,
        {},
        'is',
        user,
        'page1',
      )

      expect(errorIds(screen)).toEqual(['applicant.name', 'applicant.phone'])
      expect(applicationService.update).not.toHaveBeenCalled()
    })

    it('reports only the field that is still missing once the object exists', async () => {
      const application = createApplication()
      const { service, user } = buildService(application)

      const screen = await service.persistAnswersAndAdvance(
        application.id,
        { 'applicant.name': 'Jón' },
        'is',
        user,
        'page1',
      )

      expect(errorIds(screen)).toEqual(['applicant.phone'])
    })

    it('does not ask for a field inside an object the schema allows to be missing', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, user } = buildService(application)

      const screen = await service.persistAnswersAndAdvance(
        application.id,
        {},
        'is',
        user,
        'page2',
      )

      expect(errorIds(screen)).toEqual([])
      expect(applicationService.update).toHaveBeenCalled()
    })

    it('reports a problem inside a list item on the list field', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, user } = buildService(application)

      const screen = await service.persistAnswersAndAdvance(
        application.id,
        { files: [{ name: 1 }] },
        'is',
        user,
        'page2',
      )

      expect(errorIds(screen)).toEqual(['files'])
    })
  })

  describe('VALIDATE', () => {
    it('reports the requested fields inside an object that is missing', async () => {
      const application = createApplication()
      const { service, applicationService, user } = buildService(application)

      const result = await service.validateFields(
        application.id,
        {},
        ['applicant.name', 'applicant.phone'],
        'is',
        user,
        'page1',
      )

      expect(errorIds({ page: { errors: result.errors } })).toEqual([
        'applicant.name',
        'applicant.phone',
      ])
      expect(applicationService.update).not.toHaveBeenCalled()
    })

    it('does not refuse a changed answer from another screen, since nothing is saved', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, user } = buildService(application)

      const result = await service.validateFields(
        application.id,
        { count: 'not a number' },
        ['applicant.name'],
        'is',
        user,
        'page1',
      )

      expect(result.errors).toEqual([])
    })
  })

  describe('answers that are not on the screen', () => {
    it('refuses a changed answer the schema does not accept, and saves nothing', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, user } = buildService(application)

      await expect(
        service.persistAnswersAndAdvance(
          application.id,
          { count: 'not a number' },
          'is',
          user,
          'page2',
        ),
      ).rejects.toMatchObject({
        response: {
          type: INVALID_ANSWERS,
          status: 400,
          detail: expect.stringContaining('count'),
        },
      })

      expect(applicationService.update).not.toHaveBeenCalled()
    })

    it('does not put the value in the message', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, user } = buildService(application)

      const failure = await service
        .persistAnswersAndAdvance(
          application.id,
          { count: 'not a number' },
          'is',
          user,
          'page2',
        )
        .catch((error) => error)

      expect(JSON.stringify(failure.response)).not.toContain('not a number')
    })

    it('logs a warning with the keys, and not the values', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, logger, user } = buildService(application)

      await service
        .persistAnswersAndAdvance(
          application.id,
          { count: 'not a number' },
          'is',
          user,
          'page2',
        )
        .catch(() => undefined)

      expect(logger.warn).toHaveBeenCalledWith(
        'SDF refused changed answers that are not valid',
        { keys: ['count'] },
      )
      expect(JSON.stringify(logger.warn.mock.calls)).not.toContain(
        'not a number',
      )
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('refuses the changed answers when the check itself throws on them', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, logger, user } =
        buildService(application)

      await expect(
        service.persistAnswersAndAdvance(
          application.id,
          { weird: 5 },
          'is',
          user,
          'page2',
        ),
      ).rejects.toMatchObject({
        response: {
          type: INVALID_ANSWERS,
          detail: expect.stringContaining('weird'),
        },
      })

      expect(applicationService.update).not.toHaveBeenCalled()
      expect(logger.warn).toHaveBeenCalledWith(
        'Zod validation error during answer validation',
        expect.any(Error),
      )
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('accepts a value the client sends again unchanged, even if the schema would not', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
        count: 'stale',
      })
      const { service, applicationService, user } = buildService(application)

      await service.persistAnswersAndAdvance(
        application.id,
        { count: 'stale' },
        'is',
        user,
        'page2',
      )

      expect(applicationService.update).toHaveBeenCalled()
    })

    it('accepts a cleared answer for a field that has no stored value', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, user } = buildService(application)

      await service.persistAnswersAndAdvance(
        application.id,
        { count: '' },
        'is',
        user,
        'page2',
      )

      expect(applicationService.update).toHaveBeenCalled()
    })

    it('accepts a changed answer that the schema accepts', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, user } = buildService(application)

      await service.persistAnswersAndAdvance(
        application.id,
        { count: 5 },
        'is',
        user,
        'page2',
      )

      expect(applicationService.update).toHaveBeenCalled()
    })
  })

  describe('SUBMIT', () => {
    it('refuses a changed answer from another screen that the schema does not accept', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationService, applicationActionService, user } =
        buildService(application)

      await expect(
        service.handleSubmit(
          application.id,
          DefaultEvents.SUBMIT,
          { count: 'not a number' },
          'is',
          user,
          'page3',
        ),
      ).rejects.toMatchObject({
        response: { type: INVALID_ANSWERS, status: 400 },
      })

      expect(applicationService.update).not.toHaveBeenCalled()
      expect(applicationActionService.changeState).not.toHaveBeenCalled()
    })

    it('sends the user back to an earlier screen with a missing required field', async () => {
      const application = createApplication()
      const { service, applicationActionService, user } =
        buildService(application)

      const screen = await service.handleSubmit(
        application.id,
        DefaultEvents.SUBMIT,
        {},
        'is',
        user,
        'page3',
      )

      expect(screen.page.id).toBe('page1')
      expect(errorIds(screen)).toEqual(['applicant.name', 'applicant.phone'])
      expect(applicationActionService.changeState).not.toHaveBeenCalled()
    })

    it('goes through when every screen is valid', async () => {
      const application = createApplication({
        applicant: { name: 'Jón', phone: '1' },
      })
      const { service, applicationActionService, user } =
        buildService(application)

      await service.handleSubmit(
        application.id,
        DefaultEvents.SUBMIT,
        {},
        'is',
        user,
        'page3',
      )

      expect(applicationActionService.changeState).toHaveBeenCalled()
    })
  })
})
