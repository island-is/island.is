import {
  buildDescriptionField,
  buildDisplayField,
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  expr,
} from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'
import type { ApplicationWithAttachments } from '@island.is/application/types'
import { createApplicationTemplate } from '@island.is/application/testing'

import { SdfScreenService } from '../sdf-screen.service'

const getApplicationTemplateByTypeIdMock = jest.fn()

jest.mock('@island.is/application/template-loader', () => ({
  getApplicationTemplateByTypeId: (...args: unknown[]) =>
    getApplicationTemplateByTypeIdMock(...args),
}))

const createResolver = () => ({
  resolve: (value: unknown) => (typeof value === 'string' ? value : ''),
  // Mirror the real FormTextResolver, which exposes the underlying
  // `formatMessage` via a `format` getter. `buildHeader` uses it to resolve the
  // application/institution name; a string passes through, a MessageDescriptor
  // falls back to its defaultMessage/id.
  format: (message: unknown) =>
    typeof message === 'string'
      ? message
      : (message as { defaultMessage?: string; id?: string })?.defaultMessage ??
        (message as { id?: string })?.id ??
        '',
})

const createScreenForm = () =>
  buildForm({
    id: 'refetchForm',
    title: 'Refetch form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page',
            title: 'Page',
            children: [
              buildDescriptionField({
                id: 'description',
                title: 'Description',
              }),
            ],
          }),
        ],
      }),
    ],
  })

const createTwoPageScreenForm = () =>
  buildForm({
    id: 'refetchForm',
    title: 'Refetch form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page0',
            title: 'Page 0',
            children: [
              buildTextField({
                id: 'selectedPlot',
                title: 'Plot',
              }),
            ],
          }),
          buildMultiField({
            id: 'page1',
            title: 'Page 1',
            children: [
              buildDescriptionField({
                id: 'plotDetails',
                title: 'Plot details',
              }),
            ],
          }),
        ],
      }),
    ],
  })

const createDependencyScreenForm = () =>
  buildForm({
    id: 'dependencyForm',
    title: 'Dependency form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page0',
            title: 'Page 0',
            children: [
              buildTextField({
                id: 'previousPageAnswer',
                title: 'Previous page answer',
              }),
            ],
          }),
          buildMultiField({
            id: 'page1',
            title: 'Page 1',
            children: [
              buildTextField({
                id: 'currentPageAnswer',
                title: 'Current page answer',
              }),
              buildTextField({
                id: 'dependentField',
                title: 'Dependent field',
                clientShowWhen: expr.equals(
                  expr.get('previousPageAnswer'),
                  'yes',
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  })

const createDisplayRecomputeForm = () =>
  buildForm({
    id: 'displayRecomputeForm',
    title: 'Display recompute form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page',
            title: 'Page',
            children: [
              buildTextField({
                id: 'input1',
                title: 'Input 1',
              }),
              buildDisplayField({
                id: 'clientDisplay',
                title: 'Client display',
                clientValueExpression: {
                  operator: 'GET',
                  args: ['input1'],
                },
                value: () => 'client-server-value',
              }),
              buildDisplayField({
                id: 'serverDisplay',
                title: 'Server display',
                value: (answers) => String(answers.input1 ?? ''),
              }),
            ],
          }),
        ],
      }),
    ],
  })

const createApplication = (): ApplicationWithAttachments => ({
  id: '00000000-0000-0000-0000-000000000001',
  typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  applicant: '111111-3000',
  assignees: [],
  applicantActors: [],
  state: 'draft',
  status: ApplicationStatus.DRAFT,
  answers: { existing: 'answer' },
  externalData: {},
  attachments: {},
  created: new Date(),
  modified: new Date(),
  name: 'Refetch app',
  institution: 'Test institution',
  progress: 0,
  pruned: false,
})

const createApplicationModel = (
  application: ApplicationWithAttachments,
): ApplicationWithAttachments => {
  const model: { toJSON: () => ApplicationWithAttachments } = {
    toJSON: () => application,
  }

  const keys: Array<keyof ApplicationWithAttachments> = [
    'id',
    'typeId',
    'applicant',
    'assignees',
    'applicantActors',
    'state',
    'status',
    'answers',
    'externalData',
    'attachments',
    'created',
    'modified',
    'name',
    'institution',
    'progress',
    'pruned',
  ]

  for (const key of keys) {
    Object.defineProperty(model, key, {
      enumerable: false,
      get: () => application[key],
    })
  }

  return model as ApplicationWithAttachments
}

describe('SdfScreenService handleRefetch', () => {
  const lookupApi = defineTemplateApi({ action: 'lookupThing' })

  it('does not persist answers or external data during refetch', async () => {
    const application = createApplication()
    const template = createApplicationTemplate({
      stateMachineConfig: {
        initial: 'draft',
        states: {
          draft: {
            meta: {
              name: 'draft',
              status: 'draft',
              roles: [
                {
                  id: 'applicant',
                  formLoader: () => Promise.resolve(createScreenForm()),
                  read: 'all',
                  write: 'all',
                  api: [lookupApi],
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const applicationService = {
      update: jest.fn(),
      updateExternalData: jest.fn(),
    }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      performEphemeralActionOnApplication: jest.fn().mockResolvedValue({
        updatedApplication: {
          ...application,
          answers: { ...application.answers, search: { query: 'abc' } },
          externalData: {
            lookupThing: {
              status: 'success',
              date: new Date(),
              data: { options: [{ label: 'Thing', value: '1' }] },
            },
          },
        },
        hasError: false,
      }),
    }

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
      applicationService,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      },
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      },
      {},
      applicationActionService,
    )

    await service.handleRefetch(
      application.id,
      { search: { query: 'abc' } },
      [lookupApi.action],
      'is',
      { nationalId: application.applicant },
    )

    expect(applicationService.update).not.toHaveBeenCalled()
    expect(applicationService.updateExternalData).not.toHaveBeenCalled()
    expect(
      applicationActionService.performActionOnApplication,
    ).not.toHaveBeenCalled()
    expect(
      applicationActionService.performEphemeralActionOnApplication,
    ).toHaveBeenCalled()
  })

  it('preserves application metadata when ephemeral refetch returns a partial application shape', async () => {
    const application = createApplication()
    const applicationModel = createApplicationModel(application)
    const template = createApplicationTemplate({
      stateMachineConfig: {
        initial: 'draft',
        states: {
          draft: {
            meta: {
              name: 'draft',
              status: 'draft',
              roles: [
                {
                  id: 'applicant',
                  formLoader: () => Promise.resolve(createScreenForm()),
                  read: 'all',
                  write: 'all',
                  api: [lookupApi],
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const applicationService = {
      update: jest.fn(),
      updateExternalData: jest.fn(),
    }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      performEphemeralActionOnApplication: jest.fn().mockResolvedValue({
        updatedApplication: {
          answers: { ...application.answers, search: { query: 'abc' } },
          externalData: {
            lookupThing: {
              status: 'success',
              date: new Date(),
              data: { options: [{ label: 'Thing', value: '1' }] },
            },
          },
        },
        hasError: false,
      }),
    }

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
      applicationService,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(applicationModel),
      },
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      },
      {},
      applicationActionService,
    )

    await expect(
      service.handleRefetch(
        application.id,
        { search: { query: 'abc' } },
        [lookupApi.action],
        'is',
        { nationalId: application.applicant },
      ),
    ).resolves.toMatchObject({
      applicationId: application.id,
      locale: 'is',
    })

    expect(getApplicationTemplateByTypeIdMock).toHaveBeenLastCalledWith(
      application.typeId,
    )
  })

  it('keeps persisted page index during ephemeral refetch even when answers would infer a later page', async () => {
    const application = {
      ...createApplication(),
      pageIndex: 0,
      answers: {},
    }
    const template = createApplicationTemplate({
      stateMachineConfig: {
        initial: 'draft',
        states: {
          draft: {
            meta: {
              name: 'draft',
              status: 'draft',
              roles: [
                {
                  id: 'applicant',
                  formLoader: () => Promise.resolve(createTwoPageScreenForm()),
                  read: 'all',
                  write: 'all',
                  api: [lookupApi],
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const applicationService = {
      update: jest.fn(),
      updateExternalData: jest.fn(),
    }
    const applicationActionService = {
      performActionOnApplication: jest.fn(),
      performEphemeralActionOnApplication: jest.fn().mockResolvedValue({
        updatedApplication: application,
        hasError: false,
      }),
    }

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
      applicationService,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      },
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      },
      {},
      applicationActionService,
    )

    const screen = await service.handleRefetch(
      application.id,
      { selectedPlot: 'plot-a' },
      [lookupApi.action],
      'is',
      { nationalId: application.applicant },
    )

    expect(screen.page.index).toBe(0)
    expect(applicationService.update).not.toHaveBeenCalled()
  })

  it('includes answers referenced by current page client expressions', async () => {
    const application = {
      ...createApplication(),
      pageIndex: 1,
      answers: {
        previousPageAnswer: 'yes',
        currentPageAnswer: 'visible',
      },
    }
    const template = createApplicationTemplate({
      stateMachineConfig: {
        initial: 'draft',
        states: {
          draft: {
            meta: {
              name: 'draft',
              status: 'draft',
              roles: [
                {
                  id: 'applicant',
                  formLoader: () => Promise.resolve(createDependencyScreenForm()),
                  read: 'all',
                  write: 'all',
                  api: [lookupApi],
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
      {
        update: jest.fn(),
        updateExternalData: jest.fn(),
      },
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      },
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      },
      {},
      {
        performActionOnApplication: jest.fn(),
        performEphemeralActionOnApplication: jest.fn(),
      },
    )

    const screen = await service.getScreen(
      application.id,
      undefined,
      'is',
      { nationalId: application.applicant },
    )

    expect(screen.page.index).toBe(1)
    expect(screen.answers).toMatchObject({
      previousPageAnswer: 'yes',
      currentPageAnswer: 'visible',
    })
  })

  it('does not recompute display values for client-computed display fields', async () => {
    const application = {
      ...createApplication(),
      answers: {},
    }
    const template = createApplicationTemplate({
      stateMachineConfig: {
        initial: 'draft',
        states: {
          draft: {
            meta: {
              name: 'draft',
              status: 'draft',
              roles: [
                {
                  id: 'applicant',
                  formLoader: () => Promise.resolve(createDisplayRecomputeForm()),
                  read: 'all',
                  write: 'all',
                  api: [lookupApi],
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() },
      {
        update: jest.fn(),
        updateExternalData: jest.fn(),
      },
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      },
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      },
      {},
      {
        performActionOnApplication: jest.fn(),
        performEphemeralActionOnApplication: jest.fn(),
      },
    )

    const result = await service.validateFields(
      application.id,
      { input1: '42' },
      [],
      'is',
      { nationalId: application.applicant },
    )

    expect(result.displayValues).toEqual({ serverDisplay: '42' })
  })
})
