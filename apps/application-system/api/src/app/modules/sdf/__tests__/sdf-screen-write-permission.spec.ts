import {
  buildDataProviderItem,
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
  format: (message: unknown) =>
    typeof message === 'string'
      ? message
      : (message as { defaultMessage?: string; id?: string })?.defaultMessage ??
        (message as { id?: string })?.id ??
        '',
})

const restrictedApi = defineTemplateApi({ action: 'restrictedProvider' })

const createApplication = (
  overrides: Partial<ApplicationWithAttachments> = {},
): ApplicationWithAttachments =>
  ({
    id: '00000000-0000-0000-0000-000000000003',
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
    name: 'Write permission app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
    ...overrides,
  } as unknown as ApplicationWithAttachments)

const buildService = (
  application: ApplicationWithAttachments,
  applicationService: Record<string, jest.Mock>,
  applicationActionService: Record<string, jest.Mock>,
) =>
  new SdfScreenService(
    { debug: jest.fn(), error: jest.fn(), info: jest.fn() } as never,
    applicationService as never,
    {
      findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
    } as never,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
  )

// Both templates below give the role an `api: [restrictedApi]` entry —
// enough to run it under the old code, which only checked `api`-list
// membership. The only thing that varies is `write.externalData`.
const createEdpTemplate = (write: 'all' | { externalData: string[] }) =>
  createApplicationTemplate({
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
                formLoader: () =>
                  Promise.resolve(
                    buildForm({
                      id: 'form',
                      title: 'Form',
                      children: [
                        buildSection({
                          id: 'section',
                          title: 'Section',
                          children: [
                            buildExternalDataProvider({
                              id: 'edp',
                              title: 'External data',
                              dataProviders: [
                                buildDataProviderItem({
                                  provider: restrictedApi,
                                  title: 'Restricted provider',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ),
                read: 'all',
                write,
                api: [restrictedApi],
              },
            ],
          },
        },
      },
    },
  })

const createSubmitTemplate = (write: 'all' | { externalData: string[] }) =>
  createApplicationTemplate({
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
                formLoader: () =>
                  Promise.resolve(
                    buildForm({
                      id: 'form',
                      title: 'Form',
                      children: [
                        buildSection({
                          id: 'section',
                          title: 'Section',
                          children: [
                            buildMultiField({
                              id: 'page',
                              title: 'Page',
                              children: [
                                buildTextField({ id: 'field', title: 'Field' }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ),
                read: 'all',
                write,
                api: [restrictedApi],
              },
            ],
          },
          on: { SUBMIT: { target: 'draft' } },
        },
      },
    },
  })

describe('SdfScreenService — write-permission check on persisting action-run paths', () => {
  describe('persistAnswersAndAdvance (NEXT_PAGE, EXTERNAL_DATA_PROVIDER branch)', () => {
    it('rejects triggering a data provider outside the role’s write.externalData', async () => {
      const application = createApplication({ pageIndex: 0 })
      getApplicationTemplateByTypeIdMock.mockResolvedValue(
        createEdpTemplate({ externalData: ['someOtherProvider'] }),
      )

      const applicationService = { update: jest.fn() }
      const applicationActionService = {
        performActionOnApplication: jest.fn(),
      }
      const service = buildService(
        application,
        applicationService,
        applicationActionService,
      )

      await expect(
        service.persistAnswersAndAdvance(
          application.id,
          {},
          'is',
          { nationalId: application.applicant } as never,
          0,
        ),
      ).rejects.toThrow()

      expect(
        applicationActionService.performActionOnApplication,
      ).not.toHaveBeenCalled()
      expect(applicationService.update).not.toHaveBeenCalled()
    })

    it('allows it when the role has write access to the provider', async () => {
      const application = createApplication({ pageIndex: 0 })
      getApplicationTemplateByTypeIdMock.mockResolvedValue(
        createEdpTemplate({ externalData: ['restrictedProvider'] }),
      )

      const applicationService = { update: jest.fn() }
      const applicationActionService = {
        performActionOnApplication: jest
          .fn()
          .mockResolvedValue({ hasError: false }),
      }
      const service = buildService(
        application,
        applicationService,
        applicationActionService,
      )

      await service.persistAnswersAndAdvance(
        application.id,
        {},
        'is',
        { nationalId: application.applicant } as never,
        0,
      )

      expect(
        applicationActionService.performActionOnApplication,
      ).toHaveBeenCalled()
    })

    it('allows it when the role has write: "all"', async () => {
      const application = createApplication({ pageIndex: 0 })
      getApplicationTemplateByTypeIdMock.mockResolvedValue(
        createEdpTemplate('all'),
      )

      const applicationService = { update: jest.fn() }
      const applicationActionService = {
        performActionOnApplication: jest
          .fn()
          .mockResolvedValue({ hasError: false }),
      }
      const service = buildService(
        application,
        applicationService,
        applicationActionService,
      )

      await service.persistAnswersAndAdvance(
        application.id,
        {},
        'is',
        { nationalId: application.applicant } as never,
        0,
      )

      expect(
        applicationActionService.performActionOnApplication,
      ).toHaveBeenCalled()
    })
  })

  describe('handleSubmit', () => {
    it('rejects triggering a data provider outside the role’s write.externalData, and never reaches changeState', async () => {
      const application = createApplication({ pageIndex: 0 })
      getApplicationTemplateByTypeIdMock.mockResolvedValue(
        createSubmitTemplate({ externalData: ['someOtherProvider'] }),
      )

      const applicationService = { update: jest.fn() }
      const applicationActionService = {
        performActionOnApplication: jest.fn(),
        changeState: jest.fn().mockResolvedValue({ hasError: false }),
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
          undefined,
          'is',
          { nationalId: application.applicant } as never,
        ),
      ).rejects.toThrow()

      expect(
        applicationActionService.performActionOnApplication,
      ).not.toHaveBeenCalled()
      expect(applicationActionService.changeState).not.toHaveBeenCalled()
    })

    it('allows it and reaches changeState when the role has write access', async () => {
      const application = createApplication({ pageIndex: 0 })
      getApplicationTemplateByTypeIdMock.mockResolvedValue(
        createSubmitTemplate({ externalData: ['restrictedProvider'] }),
      )

      const applicationService = { update: jest.fn() }
      const applicationActionService = {
        performActionOnApplication: jest.fn().mockResolvedValue({}),
        changeState: jest.fn().mockResolvedValue({ hasError: false }),
      }
      const service = buildService(
        application,
        applicationService,
        applicationActionService,
      )

      await service.handleSubmit(
        application.id,
        DefaultEvents.SUBMIT,
        undefined,
        'is',
        { nationalId: application.applicant } as never,
      )

      expect(
        applicationActionService.performActionOnApplication,
      ).toHaveBeenCalled()
      expect(applicationActionService.changeState).toHaveBeenCalled()
    })
  })
})
