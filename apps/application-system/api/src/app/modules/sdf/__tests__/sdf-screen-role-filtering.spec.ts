import {
  buildDisplayField,
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
  RoleInState,
} from '@island.is/application/types'
import type { Application } from '@island.is/application/types'
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

const createApplication = (): Application =>
  ({
    id: '00000000-0000-0000-0000-000000000001',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    applicant: '111111-3000',
    assignees: [],
    applicantActors: [],
    state: 'draft',
    status: ApplicationStatus.DRAFT,
    answers: { restrictedField: 'secret', other: 'also secret' },
    externalData: { restrictedProvider: { status: 'success' } },
    attachments: {},
    created: new Date(),
    modified: new Date(),
    name: 'Role filtering app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
  } as unknown as Application)

const buildService = () =>
  new SdfScreenService(
    { debug: jest.fn(), error: jest.fn(), info: jest.fn() } as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  )

describe('SdfScreenService filterDataByRole', () => {
  const callFilterDataByRole = (
    service: SdfScreenService,
    application: Application,
    roleInState: RoleInState,
  ) =>
    (
      service as unknown as {
        filterDataByRole: (
          application: Application,
          roleInState: RoleInState,
        ) => { answers: unknown; externalData: unknown }
      }
    ).filterDataByRole(application, roleInState)

  it('returns full data when read or write is "all"', () => {
    const application = createApplication()
    const service = buildService()

    const result = callFilterDataByRole(service, application, {
      id: 'applicant',
      read: 'all',
    } as RoleInState)

    expect(result).toEqual({
      answers: application.answers,
      externalData: application.externalData,
    })
  })

  it('returns only the declared keys when read/write are scoped objects', () => {
    const application = createApplication()
    const service = buildService()

    const result = callFilterDataByRole(service, application, {
      id: 'assignee',
      read: { answers: ['other'], externalData: [] },
    } as RoleInState)

    expect(result).toEqual({
      answers: { other: 'also secret' },
      externalData: {},
    })
  })

  it('denies by default when neither read nor write is configured', () => {
    const application = createApplication()
    const service = buildService()

    const result = callFilterDataByRole(service, application, {
      id: 'bystander',
    } as RoleInState)

    expect(result).toEqual({ answers: {}, externalData: {} })
  })
})

describe('SdfScreenService getScreen — role filtering holds at the render layer', () => {
  it('does not leak a restricted answer via screen.answers or a DisplayField on the same page', async () => {
    const application = {
      id: '00000000-0000-0000-0000-000000000002',
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      applicant: '111111-3000',
      assignees: [],
      applicantActors: [],
      state: 'draft',
      status: ApplicationStatus.DRAFT,
      answers: {
        visibleField: 'ok to see',
        restrictedField: 'top secret',
      },
      externalData: {},
      attachments: {},
      created: new Date(),
      modified: new Date(),
      name: 'Role filtering render app',
      institution: 'Test institution',
      progress: 0,
      pruned: false,
    } as unknown as Application

    const form = buildForm({
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
                buildTextField({ id: 'visibleField', title: 'Visible' }),
                buildTextField({
                  id: 'restrictedField',
                  title: 'Restricted',
                }),
                buildDisplayField({
                  id: 'restrictedDisplay',
                  title: 'Restricted display',
                  value: (answers) => String(answers.restrictedField ?? ''),
                }),
              ],
            }),
          ],
        }),
      ],
    })

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
                  formLoader: () => Promise.resolve(form),
                  read: { answers: ['visibleField'], externalData: [] },
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    const service = new SdfScreenService(
      { debug: jest.fn(), error: jest.fn(), info: jest.fn() } as never,
      { update: jest.fn() } as never,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      } as never,
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      } as never,
      {} as never,
      { performActionOnApplication: jest.fn() } as never,
    )

    const screen = await service.getScreen(application.id, undefined, 'is', {
      nationalId: application.applicant,
    } as never)

    expect(screen.answers ?? {}).not.toHaveProperty('restrictedField')
    expect(JSON.stringify(screen)).not.toContain('top secret')
  })
})
