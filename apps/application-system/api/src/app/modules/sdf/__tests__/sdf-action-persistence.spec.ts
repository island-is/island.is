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
import type {
  ApplicationWithAttachments,
  TemplateApi,
} from '@island.is/application/types'
import { createApplicationTemplate } from '@island.is/application/testing'
import type { User } from '@island.is/auth-nest-tools'
import { z } from 'zod'
import { ConflictException, HttpException } from '@nestjs/common'

import { SdfController } from '../sdf.controller'
import { SdfScreenService } from '../sdf-screen.service'
import { ExecuteActionDto, SdfActionType } from '../dto/action.dto'
import type { ScreenDto, ValidateResponseDto } from '../dto/screen.dto'

// Runs every SdfActionType through the real SdfController and SdfScreenService,
// with their dependencies mocked, and checks what each action persists and
// which side effects it triggers.

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

const APPLICANT = '111111-3000'
const ACTOR = '0101302399'

const providerApi = defineTemplateApi({ action: 'providerAction' })
const otherApi = defineTemplateApi({ action: 'otherAction' })

const twoPageForm = () =>
  buildForm({
    id: 'form',
    title: 'Form',
    children: [
      buildSection({
        id: 'section',
        title: 'Section',
        children: [
          buildMultiField({
            id: 'page0',
            title: 'Page 0',
            children: [buildTextField({ id: 'field0', title: 'Field 0' })],
          }),
          buildMultiField({
            id: 'page1',
            title: 'Page 1',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
        ],
      }),
    ],
  })

const dataProviderThenPageForm = () =>
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
                provider: providerApi,
                title: 'Provider',
              }),
            ],
          }),
          buildMultiField({
            id: 'page1',
            title: 'Page 1',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
        ],
      }),
    ],
  })

// Permissive, so validation never blocks the action under test.
const permissiveSchema = z.object({}).passthrough()
// Used by the rows that check what happens when validation fails.
const strictSchema = z.object({
  field0: z.string().min(1),
  edp: z.literal(true),
})

const createTemplate = (
  form: () => ReturnType<typeof buildForm>,
  dataSchema: z.ZodTypeAny,
) =>
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
                formLoader: () => Promise.resolve(form()),
                read: 'all',
                write: 'all',
                api: [providerApi, otherApi],
              },
            ],
          },
          on: {
            SUBMIT: { target: 'draft' },
            APPROVE: { target: 'draft' },
          },
        },
      },
    },
  })

type ApplicationRow = ApplicationWithAttachments & { pageIndex: number }

const createApplicationRow = (
  overrides: Partial<ApplicationRow>,
): ApplicationRow =>
  ({
    id: '00000000-0000-0000-0000-000000000004',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    applicant: APPLICANT,
    assignees: [],
    applicantActors: [],
    state: 'draft',
    status: ApplicationStatus.DRAFT,
    answers: {},
    externalData: {},
    attachments: {},
    created: new Date(),
    modified: new Date(),
    name: 'Persistence app',
    institution: 'Test institution',
    progress: 0,
    pruned: false,
    pageIndex: 0,
    ...overrides,
  } as unknown as ApplicationRow)

interface ActionResult {
  hasError: boolean
  error?: string
}

const succeeded: ActionResult = { hasError: false }

const buildController = (
  row: ApplicationRow,
  results: {
    persistingAction: ActionResult
    ephemeralAction: ActionResult
    changeState: Record<string, unknown>
  },
) => {
  // Stands in for the database row: `update` merges into it and every fetch
  // returns a copy, so the service sees its own earlier writes.
  const applicationService = {
    update: jest.fn(async (_id: string, data: Partial<ApplicationRow>) => {
      Object.assign(row, data)
    }),
    // SDF must not call these directly; a direct call would bypass the mocked
    // action service. Its indirect writes are covered by the action calls and
    // state changes each row records.
    updateExternalData: jest.fn(),
    updateApplicationState: jest.fn(),
  }
  // Both action mocks return the application they were given, like the real
  // ones. Returning the fixture instead would drop the request's answers.
  const echoApplication = (result: ActionResult) =>
    jest.fn(async (app: ApplicationWithAttachments) => ({
      ...result,
      updatedApplication: app,
    }))
  const applicationActionService = {
    performActionOnApplication: echoApplication(results.persistingAction),
    performEphemeralActionOnApplication: echoApplication(
      results.ephemeralAction,
    ),
    changeState: jest.fn().mockResolvedValue(results.changeState),
  }
  const service = new SdfScreenService(
    {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    } as never,
    applicationService as never,
    {
      findOneByIdAndNationalId: jest.fn(async () => ({ ...row })),
    } as never,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
  )
  return {
    controller: new SdfController(service),
    applicationService,
    applicationActionService,
  }
}

const transitioned = { hasError: false, hasChanged: true }

const EVENT_NOT_HANDLED =
  'https://island.is/problems/application-system/sdf/event-not-handled'

interface ActionCall {
  actions: string[]
  event: string
  // The answers on the application the actions receive.
  answers: Record<string, unknown>
}

interface StateChangeCall {
  answers: Record<string, unknown>
  event: string
}

interface PersistenceCase {
  label: string
  form: () => ReturnType<typeof buildForm>
  dataSchema?: z.ZodTypeAny
  // The stored application before the action. Defaults to page 0, no answers.
  application?: Partial<ApplicationRow>
  user?: Partial<User>
  dto: Omit<ExecuteActionDto, 'locale'>
  persistingActionResult?: ActionResult
  ephemeralActionResult?: ActionResult
  changeStateResult?: Record<string, unknown>
  // When set, the action must fail with an error matching all given fields.
  // The fields below then describe what still happened before it failed.
  rejects?: {
    type?: new (...args: never[]) => Error
    message?: RegExp
    problemType?: string
  }
  // Component ids of the validation errors on the returned Screen.
  validationErrors?: string[]
  // The data passed to each applicationService.update call, in call order.
  saves: Record<string, unknown>[]
  // The template API actions and event passed to each call, in call order.
  persistingActions: ActionCall[]
  ephemeralActions: ActionCall[]
  // The answers and event passed to each changeState call.
  stateChanges: StateChangeCall[]
}

const SUBMIT_EVENT = DefaultEvents.APPROVE

// For the rows that check new answers are merged into saved ones, including a
// dotted key that has to land inside an existing nested object.
const savedAnswers = () => ({ earlier: 'x', nested: { kept: 'y' } })
const newAnswers = { field0: 'value', 'nested.leaf': 'z' }
const mergedAnswers = {
  earlier: 'x',
  field0: 'value',
  nested: { kept: 'y', leaf: 'z' },
}
const providerFailed: ActionResult = {
  hasError: true,
  error: 'Provider failed',
}
const roleActions = [providerApi.action, otherApi.action]

// One entry per SdfActionType, each with at least one row. A row states what
// the action saves, which template API actions it runs with which event, and
// what it passes to changeState. Some rows cover failures: NEXT_PAGE with a
// stale page index, NEXT_PAGE and REFETCH with a failing action, NEXT_PAGE and
// SUBMIT blocked by validation, and SUBMIT with a failed or unmatched state
// change. A new action type fails the coverage test until it has an entry
// with a row.
const cases: Record<SdfActionType, PersistenceCase[]> = {
  [SdfActionType.NEXT_PAGE]: [
    {
      label: 'from a normal page',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        lastKnownPageIndex: 0,
      },
      saves: [
        { answers: { field0: 'value' }, applicantActors: [], pageIndex: 1 },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'merging with saved answers',
      form: twoPageForm,
      application: { answers: savedAnswers() },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: newAnswers,
        lastKnownPageIndex: 0,
      },
      saves: [{ answers: mergedAnswers, applicantActors: [], pageIndex: 1 }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'by a delegated actor',
      form: twoPageForm,
      user: { actor: { nationalId: ACTOR } } as Partial<User>,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        lastKnownPageIndex: 0,
      },
      saves: [
        {
          answers: { field0: 'value' },
          applicantActors: [ACTOR],
          pageIndex: 1,
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Only the providers the screen declares run, not every role action.
      label: 'from a data-provider screen',
      form: dataProviderThenPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        lastKnownPageIndex: 0,
      },
      saves: [{ answers: {}, applicantActors: [], pageIndex: 1 }],
      persistingActions: [
        {
          actions: [providerApi.action],
          event: DefaultEvents.SUBMIT,
          answers: {},
        },
      ],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a data-provider screen when the provider fails',
      form: dataProviderThenPageForm,
      persistingActionResult: providerFailed,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        lastKnownPageIndex: 0,
      },
      rejects: { message: /Provider failed/ },
      saves: [],
      persistingActions: [
        {
          actions: [providerApi.action],
          event: DefaultEvents.SUBMIT,
          answers: {},
        },
      ],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a data-provider screen that fails validation',
      form: dataProviderThenPageForm,
      dataSchema: strictSchema,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        lastKnownPageIndex: 0,
      },
      validationErrors: ['edp'],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'with a stale lastKnownPageIndex',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        lastKnownPageIndex: 1,
      },
      rejects: { type: ConflictException, message: /Idempotency check failed/ },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
  [SdfActionType.PREV_PAGE]: [
    {
      label: 'from the second page',
      form: twoPageForm,
      application: { pageIndex: 1 },
      dto: { actionType: SdfActionType.PREV_PAGE },
      saves: [{ pageIndex: 0 }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from the first page',
      form: twoPageForm,
      dto: { actionType: SdfActionType.PREV_PAGE },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
  [SdfActionType.GO_TO_PAGE]: [
    {
      label: 'to another page',
      form: twoPageForm,
      dto: { actionType: SdfActionType.GO_TO_PAGE, event: 'page1' },
      saves: [{ pageIndex: 1 }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'to the current page',
      form: twoPageForm,
      application: { pageIndex: 1 },
      dto: { actionType: SdfActionType.GO_TO_PAGE, event: 'page1' },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'to an unknown page',
      form: twoPageForm,
      application: { pageIndex: 1 },
      dto: { actionType: SdfActionType.GO_TO_PAGE, event: 'noSuchPage' },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
  // These rows send a non-default event, so a hardcoded 'SUBMIT' anywhere on
  // the way to changeState shows up.
  [SdfActionType.SUBMIT]: [
    {
      // changeState must get the answers that were just saved. The last save
      // is getScreen resuming at the first unanswered page, because pageIndex
      // is 0 and the application now has answers.
      label: 'with answers',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
      },
      saves: [
        { answers: { field0: 'value' } },
        { pageIndex: 0 },
        { pageIndex: 1 },
      ],
      persistingActions: [
        {
          actions: roleActions,
          event: SUBMIT_EVENT,
          answers: { field0: 'value' },
        },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'merging with saved answers',
      form: twoPageForm,
      application: { answers: savedAnswers() },
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: newAnswers,
      },
      saves: [{ answers: mergedAnswers }, { pageIndex: 0 }, { pageIndex: 1 }],
      persistingActions: [
        { actions: roleActions, event: SUBMIT_EVENT, answers: mergedAnswers },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: mergedAnswers, event: SUBMIT_EVENT }],
    },
    {
      // Unlike NEXT_PAGE, SUBMIT doesn't add the actor to applicantActors.
      label: 'by a delegated actor',
      form: twoPageForm,
      user: { actor: { nationalId: ACTOR } } as Partial<User>,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
      },
      saves: [
        { answers: { field0: 'value' } },
        { pageIndex: 0 },
        { pageIndex: 1 },
      ],
      persistingActions: [
        {
          actions: roleActions,
          event: SUBMIT_EVENT,
          answers: { field0: 'value' },
        },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'without answers',
      form: twoPageForm,
      dto: { actionType: SdfActionType.SUBMIT, event: SUBMIT_EVENT },
      saves: [{ pageIndex: 0 }],
      persistingActions: [
        { actions: roleActions, event: SUBMIT_EVENT, answers: {} },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: {}, event: SUBMIT_EVENT }],
    },
    {
      label: 'that fails validation',
      form: twoPageForm,
      dataSchema: strictSchema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: '' },
      },
      validationErrors: ['field0'],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    // The two rows below document current behaviour: the answers and the
    // role's actions are saved before the state change is attempted, and only
    // the pageIndex reset is skipped when it fails.
    {
      label: 'when the state change fails',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
      },
      changeStateResult: {
        hasError: true,
        hasChanged: false,
        error: 'Provider failed',
      },
      rejects: { message: /State transition failed/ },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [
        {
          actions: roleActions,
          event: SUBMIT_EVENT,
          answers: { field0: 'value' },
        },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'when no transition handles the event',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
      },
      changeStateResult: {
        hasError: false,
        hasChanged: false,
        hasMatchedTransition: false,
      },
      rejects: { type: ConflictException, problemType: EVENT_NOT_HANDLED },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [
        {
          actions: roleActions,
          event: SUBMIT_EVENT,
          answers: { field0: 'value' },
        },
      ],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
  ],
  [SdfActionType.REFETCH]: [
    {
      // With these answers and pageIndex 0, a non-ephemeral getScreen would
      // save a "resume" pageIndex, so this row also guards that flag.
      label: 'running one of the role actions',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [providerApi.action],
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [
        {
          actions: [providerApi.action],
          event: SdfActionType.REFETCH,
          answers: { field0: 'value' },
        },
      ],
      stateChanges: [],
    },
    {
      label: 'when the action fails',
      form: twoPageForm,
      ephemeralActionResult: providerFailed,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [providerApi.action],
      },
      rejects: { message: /Provider failed/ },
      saves: [],
      persistingActions: [],
      ephemeralActions: [
        {
          actions: [providerApi.action],
          event: SdfActionType.REFETCH,
          answers: { field0: 'value' },
        },
      ],
      stateChanges: [],
    },
    {
      label: 'requesting an action the role does not have',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: ['notARoleAction'],
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'requesting no actions',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [],
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
  [SdfActionType.VALIDATE]: [
    {
      label: 'some fields',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { field0: 'value' },
        fieldIds: ['field0'],
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
}

// performActionOnApplication and performEphemeralActionOnApplication both take
// (application, template, auth, apis, locale, event).
const actionCalls = (mock: jest.Mock): ActionCall[] =>
  mock.mock.calls.map(([app, , , apis, , event]) => ({
    actions: (apis as TemplateApi[]).map((api) => api.action),
    event,
    answers: (app as ApplicationWithAttachments).answers,
  }))

describe('SDF action persistence', () => {
  beforeEach(() => jest.clearAllMocks())

  // `cases` is typed as a Record, but ts-jest runs with isolatedModules here
  // and doesn't type-check, and the type allows empty lists anyway, so check
  // coverage at runtime too.
  it('has expectations for every SdfActionType', () => {
    expect(Object.keys(cases).sort()).toEqual(
      Object.values(SdfActionType).sort(),
    )
    const actionTypesWithoutRows = Object.entries(cases)
      .filter(([, actionCases]) => actionCases.length === 0)
      .map(([actionType]) => actionType)
    expect(actionTypesWithoutRows).toEqual([])
  })

  const rows = Object.entries(cases).flatMap(([actionType, actionCases]) =>
    actionCases.map((c) => ({ ...c, actionType })),
  )

  it.each(rows)('$actionType $label', async (c) => {
    const row = createApplicationRow(c.application ?? {})
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(c.form, c.dataSchema ?? permissiveSchema),
    )
    const { controller, applicationService, applicationActionService } =
      buildController(row, {
        persistingAction: c.persistingActionResult ?? succeeded,
        ephemeralAction: c.ephemeralActionResult ?? succeeded,
        changeState: c.changeStateResult ?? transitioned,
      })

    const request = controller.executeAction(
      row.id,
      { ...c.dto, locale: 'is' } as ExecuteActionDto,
      { nationalId: APPLICANT, ...c.user } as User,
    )

    if (c.rejects) {
      // If the request resolves, `error` is the response and the checks fail.
      const error = await request.catch((e: unknown) => e)
      expect(error).toBeInstanceOf(c.rejects.type ?? Error)
      if (c.rejects.message) {
        expect((error as Error).message).toMatch(c.rejects.message)
      }
      if (c.rejects.problemType) {
        expect((error as HttpException).getResponse()).toMatchObject({
          type: c.rejects.problemType,
        })
      }
    } else {
      const response = await request
      // VALIDATE answers with errors only; every other action returns a Screen.
      if (c.actionType === SdfActionType.VALIDATE) {
        expect(response).not.toHaveProperty('page')
        const { errors } = response as ValidateResponseDto
        expect(errors.map((e) => e.componentId)).toEqual(
          c.validationErrors ?? [],
        )
      } else {
        expect(response).toHaveProperty('page')
        const errors = (response as ScreenDto).page.errors ?? []
        expect(errors.map((e) => e.componentId)).toEqual(
          c.validationErrors ?? [],
        )
      }
    }

    expect(
      applicationService.update.mock.calls.map(([, data]) => data),
    ).toEqual(c.saves)
    expect(applicationService.updateExternalData).not.toHaveBeenCalled()
    expect(applicationService.updateApplicationState).not.toHaveBeenCalled()

    expect(
      actionCalls(applicationActionService.performActionOnApplication),
    ).toEqual(c.persistingActions)
    expect(
      actionCalls(applicationActionService.performEphemeralActionOnApplication),
    ).toEqual(c.ephemeralActions)
    expect(
      applicationActionService.changeState.mock.calls.map(([app, , event]) => ({
        answers: (app as ApplicationWithAttachments).answers,
        event,
      })),
    ).toEqual(c.stateChanges)
  })
})
