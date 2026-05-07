import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
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
})
