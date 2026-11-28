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
    createLoggerStub() as never,
    {} as never,
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

  // `write` keys also grant visibility, matching legacy
  // `ApplicationTemplateHelper.getReadableAnswersAndExternalData`: `write:
  // 'all'` wins over a scoped `read`, and scoped `read` and `write` lists
  // combine into their union.
  describe('write access also grants visibility', () => {
    it('returns full data when write is "all" even if read is scoped', () => {
      const application = createApplication()
      const service = buildService()

      const result = callFilterDataByRole(service, application, {
        id: 'applicant',
        read: { answers: ['other'], externalData: [] },
        write: 'all',
      } as RoleInState)

      expect(result).toEqual({
        answers: application.answers,
        externalData: application.externalData,
      })
    })

    it('returns the union of scoped read and write keys', () => {
      const application = {
        ...createApplication(),
        answers: { a: 'answer a', b: 'answer b', c: 'answer c' },
        externalData: {
          x: { status: 'success', data: 'provider x' },
          y: { status: 'success', data: 'provider y' },
          z: { status: 'success', data: 'provider z' },
        },
      } as unknown as Application
      const service = buildService()

      const result = callFilterDataByRole(service, application, {
        id: 'assignee',
        read: { answers: ['a'], externalData: ['x'] },
        write: { answers: ['a', 'b'], externalData: ['y'] },
      } as RoleInState)

      expect(result).toEqual({
        answers: { a: 'answer a', b: 'answer b' },
        externalData: {
          x: { status: 'success', data: 'provider x' },
          y: { status: 'success', data: 'provider y' },
        },
      })
    })
  })

  // The returned objects are deep copies: neither top-level nor nested
  // changes to the filtered data reach the application.
  it('returns deep copies of answers and externalData', () => {
    const roles = [
      { id: 'applicant', read: 'all' },
      {
        id: 'assignee',
        read: { answers: ['nested'], externalData: ['provider'] },
      },
    ] as RoleInState[]

    for (const role of roles) {
      const application = {
        ...createApplication(),
        answers: { nested: { value: 'original' } },
        externalData: {
          provider: { status: 'success', data: { value: 'original' } },
        },
      } as unknown as Application
      const service = buildService()

      const result = callFilterDataByRole(service, application, role) as {
        answers: { nested: { value: string } }
        externalData: {
          provider: { status: string; data: { value: string } }
        }
      }

      expect(result.answers).not.toBe(application.answers)
      expect(result.externalData).not.toBe(application.externalData)
      expect(result.answers.nested).not.toBe(application.answers.nested)
      expect(result.answers.nested).toEqual(application.answers.nested)
      expect(result.externalData.provider).not.toBe(
        application.externalData.provider,
      )
      expect(result.externalData.provider).toEqual(
        application.externalData.provider,
      )

      result.answers.nested.value = 'changed'
      result.externalData.provider.data.value = 'changed'

      expect(application.answers).toEqual({ nested: { value: 'original' } })
      expect(application.externalData).toEqual({
        provider: { status: 'success', data: { value: 'original' } },
      })
    }
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
      createLoggerStub() as never,
      { update: jest.fn() } as never,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      } as never,
      {
        createResolver: jest.fn().mockResolvedValue(createResolver()),
      } as never,
      {} as never,
      { performActionOnApplication: jest.fn() } as never,
      {} as never,
    )

    const screen = await service.getScreen(application.id, undefined, 'is', {
      nationalId: application.applicant,
    } as never)

    expect(screen.answers ?? {}).not.toHaveProperty('restrictedField')
    expect(JSON.stringify(screen)).not.toContain('top secret')
  })
})

describe('SdfScreenService — texts and display values are built from what the role may read', () => {
  const user = { nationalId: '111111-3000' } as never

  const buildScenario = () => {
    const application = {
      id: '00000000-0000-0000-0000-000000000005',
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
      externalData: {
        visibleProvider: { status: 'success', data: 'shown' },
        restrictedProvider: { status: 'success', data: 'hidden' },
      },
      attachments: {},
      created: new Date(),
      modified: new Date(),
      name: 'Role filtering text app',
      institution: 'Test institution',
      progress: 0,
      pruned: false,
    } as unknown as Application

    const keysOf = (values: Record<string, unknown>) =>
      Object.keys(values).sort().join(',')

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
                buildTextField({
                  id: 'visibleField',
                  // A text that is a function of the application.
                  title: (app: Application) =>
                    `answers: ${keysOf(app.answers)}`,
                }),
                buildDisplayField({
                  id: 'display',
                  title: 'Display',
                  value: (answers, externalData) =>
                    `answers: ${keysOf(answers)} | external: ${keysOf(
                      externalData,
                    )}`,
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const template = createApplicationTemplate({
      // The name is a function of the application too.
      name: (app: Application) => `name: ${keysOf(app.answers)}`,
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
                  read: {
                    answers: ['visibleField'],
                    externalData: ['visibleProvider'],
                  },
                  write: { answers: ['visibleField'] },
                },
              ],
            },
          },
        },
      },
    })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(template)

    // A resolver that calls a function text with the application it was made
    // for, so the test sees what the service handed it.
    const createResolverMock = jest.fn(async (forApplication: Application) => ({
      resolve: (value: unknown) =>
        typeof value === 'function'
          ? String((value as (app: Application) => unknown)(forApplication))
          : typeof value === 'string'
          ? value
          : '',
      format: (message: unknown) =>
        typeof message === 'string'
          ? message
          : (message as { defaultMessage?: string })?.defaultMessage ?? '',
    }))
    const applicationService = { update: jest.fn() }

    const service = new SdfScreenService(
      createLoggerStub() as never,
      applicationService as never,
      {
        findOneByIdAndNationalId: jest.fn().mockResolvedValue(application),
      } as never,
      { createResolver: createResolverMock } as never,
      {} as never,
      { performActionOnApplication: jest.fn() } as never,
      {} as never,
    )

    // Every application a resolver was made for.
    const resolvedFor = () =>
      createResolverMock.mock.calls.map(([forApplication]) => forApplication)

    return { service, application, resolvedFor }
  }

  it('gives the screen texts and the application name only readable data', async () => {
    const { service, application, resolvedFor } = buildScenario()

    const screen = await service.getScreen(application.id, 'page', 'is', user)

    expect(screen.header.applicationName).toBe('name: visibleField')
    expect(JSON.stringify(screen)).toContain('answers: visibleField')
    expect(JSON.stringify(screen)).not.toContain('restrictedField')
    for (const forApplication of resolvedFor()) {
      expect(forApplication.answers).not.toHaveProperty('restrictedField')
    }
  })

  it('computes display values from readable answers and external data only', async () => {
    const { service, application, resolvedFor } = buildScenario()

    const result = await service.validateFields(
      application.id,
      { visibleField: 'changed' },
      ['visibleField'],
      'is',
      user,
      'page',
    )

    expect(result.displayValues).toEqual({
      display: 'answers: visibleField | external: visibleProvider',
    })
    for (const forApplication of resolvedFor()) {
      expect(forApplication.answers).not.toHaveProperty('restrictedField')
      expect(forApplication.externalData).not.toHaveProperty(
        'restrictedProvider',
      )
    }
  })

  it('builds the resolver used to validate and save from readable data only', async () => {
    const { service, application, resolvedFor } = buildScenario()

    await service.persistAnswersAndAdvance(
      application.id,
      { visibleField: 'changed' },
      'is',
      user,
      'page',
    )

    expect(resolvedFor().length).toBeGreaterThan(0)
    for (const forApplication of resolvedFor()) {
      expect(forApplication.answers).not.toHaveProperty('restrictedField')
      expect(forApplication.externalData).not.toHaveProperty(
        'restrictedProvider',
      )
    }
  })
})
