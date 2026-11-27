import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  coreErrorMessages,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import type { ApplicationWithAttachments } from '@island.is/application/types'
import { createApplicationTemplate } from '@island.is/application/testing'

import { ApplicationAccessService } from '../../application/tools/applicationAccess.service'
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

const createApplication = (
  overrides: Partial<ApplicationWithAttachments> = {},
): ApplicationWithAttachments =>
  ({
    id: '00000000-0000-0000-0000-000000000004',
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
    name: 'Pruned app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
    ...overrides,
  } as unknown as ApplicationWithAttachments)

const template = createApplicationTemplate({
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
                              buildTextField({ id: 'name', title: 'Name' }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: { SUBMIT: 'draft' },
      },
    },
  },
})

// The real access service, so what makes an application pruned is not
// reimplemented here.
const buildService = (application: ApplicationWithAttachments) => {
  const applicationService = {
    findOneById: jest.fn().mockResolvedValue(application),
    update: jest.fn(),
  }
  const applicationActionService = { changeState: jest.fn() }
  const accessService = new ApplicationAccessService(
    applicationService as never,
    {} as never,
    {} as never,
    {} as never,
  )
  const service = new SdfScreenService(
    createLoggerStub() as never,
    applicationService as never,
    accessService,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
    {} as never,
  )
  return { service, applicationService, applicationActionService }
}

// The rejection is the pruned one, not some other failure on the way.
const prunedRejection = {
  name: 'ProblemError',
  problem: {
    detail: coreErrorMessages.applicationIsPrunedAndReadOnly.defaultMessage,
  },
}

const asApplicant = (application: ApplicationWithAttachments) =>
  ({ nationalId: application.applicant } as never)

describe('SdfScreenService — pruned applications are read-only', () => {
  beforeEach(() => {
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)
  })

  it('rejects NEXT_PAGE and saves nothing', async () => {
    const application = createApplication({ pruned: true })
    const { service, applicationService } = buildService(application)

    await expect(
      service.persistAnswersAndAdvance(
        application.id,
        { name: 'changed' },
        'is',
        asApplicant(application),
        'page',
      ),
    ).rejects.toMatchObject(prunedRejection)

    expect(applicationService.update).not.toHaveBeenCalled()
  })

  it('rejects SUBMIT and changes no state', async () => {
    const application = createApplication({ pruned: true })
    const { service, applicationService, applicationActionService } =
      buildService(application)

    await expect(
      service.handleSubmit(
        application.id,
        'SUBMIT',
        { name: 'changed' },
        'is',
        asApplicant(application),
        'page',
      ),
    ).rejects.toMatchObject(prunedRejection)

    expect(applicationService.update).not.toHaveBeenCalled()
    expect(applicationActionService.changeState).not.toHaveBeenCalled()
  })

  it('still lets the user read it', async () => {
    const application = createApplication({ pruned: true })
    const { service } = buildService(application)

    const screen = await service.getScreen(
      application.id,
      'page',
      'is',
      asApplicant(application),
    )

    expect(screen.page.id).toBe('page')
  })

  it('saves NEXT_PAGE answers for an application that is not pruned', async () => {
    const application = createApplication({ pruned: false })
    const { service, applicationService } = buildService(application)

    await service.persistAnswersAndAdvance(
      application.id,
      { name: 'changed' },
      'is',
      asApplicant(application),
      'page',
    )

    expect(applicationService.update).toHaveBeenCalledWith(
      application.id,
      expect.objectContaining({ answers: { name: 'changed' } }),
    )
  })
})
