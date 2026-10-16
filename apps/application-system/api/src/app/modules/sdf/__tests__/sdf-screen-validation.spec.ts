import {
  buildExternalDataProvider,
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
import { ConflictException } from '@nestjs/common'

import { SdfScreenService } from '../sdf-screen.service'

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
  approveExternalData: z.boolean().refine((v) => v),
  someRequiredField: z.string().min(1),
})

// Single EDP screen (advanced via a SUBMIT button → handleSubmit), mirroring the
// prerequisites "agree to terms" screen.
const createExternalDataForm = () =>
  buildForm({
    id: 'prereqForm',
    title: 'Prereq form',
    children: [
      buildSection({
        id: 'conditions',
        title: 'Conditions',
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: 'Approve',
            dataProviders: [],
            submitField: {
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Next', type: 'primary' },
              ],
            } as never,
          }),
        ],
      }),
    ],
  })

// Two normal pages so the first is advanced via NEXT_PAGE (not the last screen).
const createTwoPageForm = () =>
  buildForm({
    id: 'mainForm',
    title: 'Main form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page0',
            title: 'Page 0',
            children: [
              buildTextField({ id: 'someRequiredField', title: 'Required' }),
            ],
          }),
          buildMultiField({
            id: 'page1',
            title: 'Page 1',
            children: [buildTextField({ id: 'other', title: 'Other' })],
          }),
        ],
      }),
    ],
  })

const createApplication = (
  overrides: Partial<ApplicationWithAttachments> = {},
): ApplicationWithAttachments =>
  ({
    id: '00000000-0000-0000-0000-000000000001',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    applicant: '111111-3000',
    assignees: [],
    applicantActors: [],
    state: 'draft',
    status: ApplicationStatus.DRAFT,
    answers: {},
    externalData: {},
    attachments: {},
    created: new Date(),
    modified: new Date(),
    name: 'Validation app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
    ...overrides,
  } as ApplicationWithAttachments)

const createTemplate = (formLoader: () => Promise<unknown>) =>
  createApplicationTemplate({
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
                formLoader: formLoader as never,
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

const buildService = (
  application: ApplicationWithAttachments,
  applicationService: Record<string, jest.Mock>,
  applicationActionService: Record<string, jest.Mock>,
) =>
  new SdfScreenService(
    {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    } as never,
    applicationService as never,
    {
      findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
    } as never,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
  )

describe('SdfScreenService validation gates', () => {
  beforeEach(() => jest.clearAllMocks())

  it('handleSubmit blocks the transition when the EDP approval is unchecked', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createExternalDataForm())),
    )

    const applicationService = { update: jest.fn() }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      changeState: jest
        .fn()
        .mockResolvedValue({ hasError: false, hasChanged: true }),
    }
    const service = buildService(
      application,
      applicationService,
      applicationActionService,
    )

    const screen = await service.handleSubmit(
      application.id,
      DefaultEvents.SUBMIT,
      { approveExternalData: false },
      'is',
      { nationalId: application.applicant } as never,
    )

    expect(screen.page.errors).toEqual([
      expect.objectContaining({ componentId: 'approveExternalData' }),
    ])
    expect(applicationActionService.changeState).not.toHaveBeenCalled()
    expect(applicationService.update).not.toHaveBeenCalled()
  })

  it('handleSubmit allows the transition when the EDP approval is checked', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createExternalDataForm())),
    )

    const applicationService = { update: jest.fn() }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      changeState: jest
        .fn()
        .mockResolvedValue({ hasError: false, hasChanged: true }),
    }
    const service = buildService(
      application,
      applicationService,
      applicationActionService,
    )

    const screen = await service.handleSubmit(
      application.id,
      DefaultEvents.SUBMIT,
      { approveExternalData: true },
      'is',
      { nationalId: application.applicant } as never,
    )

    expect(screen.page.errors ?? []).toEqual([])
    expect(applicationActionService.changeState).toHaveBeenCalled()
  })

  it('handleSubmit rejects with 409, and keeps the page cursor, when no transition handles the event', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createExternalDataForm())),
    )

    const applicationService = { update: jest.fn() }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      // e.g. every guard on the event failed
      changeState: jest.fn().mockResolvedValue({
        hasError: false,
        hasChanged: false,
        hasMatchedTransition: false,
      }),
    }
    const service = buildService(
      application,
      applicationService,
      applicationActionService,
    )

    await expect(
      service.handleSubmit(
        application.id,
        DefaultEvents.SUBMIT,
        { approveExternalData: true },
        'is',
        { nationalId: application.applicant } as never,
      ),
    ).rejects.toBeInstanceOf(ConflictException)

    expect(applicationService.update).not.toHaveBeenCalledWith(
      application.id,
      expect.objectContaining({ pageIndex: 0 }),
    )
  })

  it('handleSubmit accepts a matched no-op self-transition', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createExternalDataForm())),
    )

    const applicationService = { update: jest.fn() }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      // e.g. `draft: { on: { SUBMIT: { target: 'draft' } } }` with no actions
      changeState: jest.fn().mockResolvedValue({
        hasError: false,
        hasChanged: false,
        hasMatchedTransition: true,
      }),
    }
    const service = buildService(
      application,
      applicationService,
      applicationActionService,
    )

    await expect(
      service.handleSubmit(
        application.id,
        DefaultEvents.SUBMIT,
        { approveExternalData: true },
        'is',
        { nationalId: application.applicant } as never,
      ),
    ).resolves.toBeDefined()
  })

  it('persistAnswersAndAdvance still blocks a missing required field on NEXT_PAGE', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createTwoPageForm())),
    )

    const applicationService = { update: jest.fn() }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      changeState: jest.fn(),
    }
    const service = buildService(
      application,
      applicationService,
      applicationActionService,
    )

    const screen = await service.persistAnswersAndAdvance(
      application.id,
      {},
      'is',
      { nationalId: application.applicant } as never,
      0,
    )

    expect(screen.page.errors).toEqual([
      expect.objectContaining({ componentId: 'someRequiredField' }),
    ])
    expect(applicationService.update).not.toHaveBeenCalled()
  })

  it('validateFields only returns errors for the requested fields', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createTwoPageForm())),
    )
    const service = buildService(application, {}, {})
    const user = { nationalId: application.applicant } as never

    // Both schema fields are invalid when nothing is answered.
    const both = await service.validateFields(
      application.id,
      {},
      ['someRequiredField', 'approveExternalData'],
      'is',
      user,
    )
    const one = await service.validateFields(
      application.id,
      {},
      ['someRequiredField'],
      'is',
      user,
    )

    expect(both.errors.map((e) => e.componentId).sort()).toEqual([
      'approveExternalData',
      'someRequiredField',
    ])
    expect(one.errors).toEqual([
      expect.objectContaining({ componentId: 'someRequiredField' }),
    ])
  })

  it('validateFields skips validation when no fields are requested', async () => {
    const application = createApplication({ pageIndex: 0 })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(() => Promise.resolve(createTwoPageForm())),
    )
    const service = buildService(application, {}, {})
    const safeParse = jest.spyOn(dataSchema, 'safeParse')

    try {
      const result = await service.validateFields(
        application.id,
        {},
        [],
        'is',
        { nationalId: application.applicant } as never,
      )

      expect(result.errors).toEqual([])
      expect(safeParse).not.toHaveBeenCalled()
    } finally {
      safeParse.mockRestore()
    }
  })
})
