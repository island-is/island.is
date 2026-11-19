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
  ReadWriteValues,
  TemplateApi,
} from '@island.is/application/types'
import { createApplicationTemplate } from '@island.is/application/testing'
import type { User } from '@island.is/auth-nest-tools'
import { z } from 'zod'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common'
import cloneDeep from 'lodash/cloneDeep'
import escapeRegExp from 'lodash/escapeRegExp'

import { ApplicationValidationService } from '../../application/tools/applicationTemplateValidation.service'
import { SdfController } from '../sdf.controller'
import { SdfScreenService } from '../sdf-screen.service'
import { ExecuteActionDto, SdfActionType } from '../dto/action.dto'
import type {
  ScreenDto,
  ValidateResponseDto,
  ValidationErrorDto,
} from '../dto/screen.dto'

// Runs every SdfActionType through the real SdfController and SdfScreenService,
// with their dependencies mocked, and checks what each action persists and
// which side effects it triggers.

const getApplicationTemplateByTypeIdMock = jest.fn()

jest.mock('@island.is/application/template-loader', () => ({
  getApplicationTemplateByTypeId: (...args: unknown[]) =>
    getApplicationTemplateByTypeIdMock(...args),
}))

// Resolves a message descriptor to its defaultMessage, so the rows can tell a
// template's own message from the generic default.
const resolveText = (message: unknown) =>
  typeof message === 'string'
    ? message
    : (message as { defaultMessage?: string; id?: string })?.defaultMessage ??
      (message as { id?: string })?.id ??
      ''

const createResolver = () => ({
  resolve: resolveText,
  format: resolveText,
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

// Page 0 is never shown; page 1 is the first page the applicant can open.
const hiddenFirstPageForm = () =>
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
            condition: () => false,
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

// Page 0 holds a single text field with a static default.
const defaultedFieldForm = (fieldId: string, defaultValue: string) => () =>
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
            children: [
              buildTextField({ id: fieldId, title: 'Field 0', defaultValue }),
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

// SUBMIT is only accepted on the last screen, so its rows use these.
const onePageForm = () =>
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
        ],
      }),
    ],
  })

// Page 1 is shown unless field0 is 'hide', so page 0 is then the last screen.
const hideablePageForm = () =>
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
            condition: (answers) => answers.field0 !== 'hide',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
        ],
      }),
    ],
  })

// The middle page is shown only when `wantsMiddle` is 'yes'.
const conditionalMiddlePageForm = () =>
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
            condition: (answers) => answers.wantsMiddle === 'yes',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
          buildMultiField({
            id: 'page2',
            title: 'Page 2',
            children: [buildTextField({ id: 'field2', title: 'Field 2' })],
          }),
        ],
      }),
    ],
  })

// Page 1 is shown only once the provider has returned a result.
const providerGatesPageForm = () =>
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
            condition: (_answers, externalData) =>
              externalData[providerApi.action]?.status === 'success',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
          buildMultiField({
            id: 'page2',
            title: 'Page 2',
            children: [buildTextField({ id: 'field2', title: 'Field 2' })],
          }),
        ],
      }),
    ],
  })

// Page 1 is shown until the provider has returned a result.
const providerHidesPageForm = () =>
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
            condition: (_answers, externalData) =>
              externalData[providerApi.action]?.status !== 'success',
            children: [buildTextField({ id: 'field1', title: 'Field 1' })],
          }),
          buildMultiField({
            id: 'page2',
            title: 'Page 2',
            children: [buildTextField({ id: 'field2', title: 'Field 2' })],
          }),
        ],
      }),
    ],
  })

const dataProviderOnlyForm = () =>
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
// Used by the SUBMIT rows that check the pages before the one submitted from.
const field1Schema = z.object({ field1: z.string().min(1) }).passthrough()
const field0AndField1Schema = z
  .object({ field0: z.string().min(1), field1: z.string().min(1) })
  .passthrough()
const field0AndField2Schema = z
  .object({ field0: z.string().min(1), field2: z.string().min(1) })
  .passthrough()
// Requires field0 the way templates do, with their own namespaced message.
const field0Required = {
  id: 'example.application:field0.required',
  defaultMessage: 'Field 0 is required',
}
const templateRequiredSchema = z.object({
  field0: z.string().refine((value) => !!value, { params: field0Required }),
})

// Called with (path, answer) by the template's answer validators, which accept
// every answer.
const answerValidator = jest.fn()

const createTemplate = (
  form: () => ReturnType<typeof buildForm>,
  dataSchema: z.ZodTypeAny,
  write: ReadWriteValues,
) =>
  createApplicationTemplate({
    dataSchema,
    answerValidators: {
      field0: (answer) => answerValidator('field0', answer),
      field1: (answer) => answerValidator('field1', answer),
    },
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
                // The only event the role may send. The state also accepts
                // SUBMIT, for the rows that send an event the role may not.
                actions: [
                  { event: SUBMIT_EVENT, name: 'Approve', type: 'primary' },
                ],
                read: 'all',
                write,
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

type ApplicationRow = ApplicationWithAttachments

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
    ephemeralStoresResults?: boolean
    changeState: Record<string, unknown>
  },
  // When set, every write (`update` or a persisting action) also moves the row
  // to this state, as if another request had changed it in the meantime.
  concurrentState?: string,
) => {
  const applyConcurrentState = () => {
    if (concurrentState) row.state = concurrentState
  }
  // Stands in for the database row: `update` merges into it and every fetch
  // returns a copy, so the service sees its own earlier writes.
  const applicationService = {
    update: jest.fn(async (_id: string, data: Partial<ApplicationRow>) => {
      Object.assign(row, data)
      applyConcurrentState()
    }),
    // SDF must not call these directly; a direct call would bypass the mocked
    // action service. Its indirect writes are covered by the action calls and
    // state changes each row records.
    updateExternalData: jest.fn(),
    updateApplicationState: jest.fn(),
  }
  // Both action mocks return the application they were given, like the real
  // ones. Returning the fixture instead would drop the request's answers.
  // With `storesResults`, the returned copy also holds a successful result per
  // action, as the real ephemeral runner leaves on the application it returns.
  const echoApplication = (result: ActionResult, storesResults = false) =>
    jest.fn(async (app: ApplicationWithAttachments, ...rest: unknown[]) => {
      if (!storesResults) {
        return { ...result, updatedApplication: app }
      }
      const apis = [rest[2] as TemplateApi | TemplateApi[]].flat()
      return {
        ...result,
        updatedApplication: {
          ...app,
          externalData: {
            ...app.externalData,
            ...Object.fromEntries(
              apis.map((api) => [
                api.action,
                { status: 'success' as const, data: {}, date: new Date() },
              ]),
            ),
          },
        },
      }
    })
  // Like the real one, a successful persisting action stores each action's
  // result in the row's externalData.
  const performActionOnApplication = jest.fn(
    async (app: ApplicationWithAttachments, ...rest: unknown[]) => {
      const apis = [rest[2] as TemplateApi | TemplateApi[]].flat()
      if (!results.persistingAction.hasError) {
        const resultsByAction = Object.fromEntries(
          apis.map((api) => [
            api.action,
            { status: 'success' as const, data: {}, date: new Date() },
          ]),
        )
        row.externalData = { ...row.externalData, ...resultsByAction }
        // The real runner also assigns the results on the application it is
        // given, which the caller keeps using.
        app.externalData = { ...app.externalData, ...resultsByAction }
        applyConcurrentState()
      }
      return { ...results.persistingAction, updatedApplication: app }
    },
  )
  const applicationActionService = {
    performActionOnApplication,
    performEphemeralActionOnApplication: echoApplication(
      results.ephemeralAction,
      results.ephemeralStoresResults,
    ),
    changeState: jest.fn().mockResolvedValue(results.changeState),
  }
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }
  const applicationValidationService = new ApplicationValidationService(
    logger as never,
    // The feature flag that turns the event check off stays off.
    { getValue: jest.fn().mockResolvedValue(false) } as never,
  )
  const service = new SdfScreenService(
    logger as never,
    applicationService as never,
    {
      findOneByIdAndNationalId: jest.fn(async () => ({ ...row })),
    } as never,
    { createResolver: jest.fn().mockResolvedValue(createResolver()) } as never,
    {} as never,
    applicationActionService as never,
    applicationValidationService,
  )
  return {
    controller: new SdfController(service),
    applicationService,
    applicationActionService,
    logger,
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
  // The externalData keys on the application changeState receives, when it
  // has any.
  externalData?: string[]
}

interface PersistenceCase {
  label: string
  form: () => ReturnType<typeof buildForm>
  dataSchema?: z.ZodTypeAny
  // The role's write permissions. Defaults to 'all'.
  write?: ReadWriteValues
  // When true, the template maps the user to no role.
  noRole?: boolean
  // When set, the template maps the user to this role instead of the one the
  // state declares.
  mappedRole?: string
  // The stored application before the action. Defaults to page 0, no answers.
  application?: Partial<ApplicationRow>
  user?: Partial<User>
  dto: Omit<ExecuteActionDto, 'locale'>
  persistingActionResult?: ActionResult
  ephemeralActionResult?: ActionResult
  // When true, the ephemeral action leaves a successful result per action in
  // the externalData of the application it returns.
  ephemeralStoresResults?: boolean
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
  // When set, the messages of those errors, in the same order.
  validationMessages?: string[]
  // The data passed to each applicationService.update call, in call order.
  saves: Record<string, unknown>[]
  // The template API actions and event passed to each call, in call order.
  persistingActions: ActionCall[]
  ephemeralActions: ActionCall[]
  // The answers and event passed to each changeState call.
  stateChanges: StateChangeCall[]
  // The dropped answer keys the warning must list: those the role may not
  // write and whose value differs from the stored one. Defaults to none, which
  // means no warning.
  droppedChangedKeys?: string[]
  // When set, the (path, answer) pairs the answer validators received, in call
  // order.
  validatorCalls?: [string, unknown][]
  // When set, the event the event permission check must log a warning for.
  // Defaults to no warning.
  eventWarning?: string
  // When set, saving the application or running a persisting action also
  // moves it to this state.
  concurrentState?: string
  // When set, the action types of the returned Screen's footer buttons.
  footerActionTypes?: string[]
  // When set, the page index of the returned Screen.
  screenIndex?: number
  // When set, the id of the page of the returned Screen.
  pageId?: string
  // The code of the notice on the returned Screen. Defaults to no notice.
  noticeCode?: string
}

const SUBMIT_EVENT = DefaultEvents.APPROVE
// Accepted by the state, but not in the role's actions.
const UNPERMITTED_EVENT = DefaultEvents.SUBMIT

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
// For the rows that check that answers the role may not write are dropped.
const writesField0: ReadWriteValues = {
  answers: ['field0'],
}

// One entry per SdfActionType, each with at least one row. A row states what
// the action saves, which template API actions it runs with which event, and
// what it passes to changeState. Some rows cover failures: NEXT_PAGE from a
// screen that is not shown, NEXT_PAGE and REFETCH with a failing action,
// NEXT_PAGE and SUBMIT blocked by validation, SUBMIT from a screen that is not
// the last, and SUBMIT with a failed, unmatched or concurrent state change. A
// new action type fails the coverage test until it has an entry with a row.
const cases: Record<SdfActionType, PersistenceCase[]> = {
  [SdfActionType.NEXT_PAGE]: [
    {
      label: 'from a normal page',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'value' }, applicantActors: [] }],
      pageId: 'page1',
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
        screen: 'page0',
      },
      saves: [{ answers: mergedAnswers, applicantActors: [] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The dotted key writes into the object sent under the same parent key.
      // That object belongs to the request, so it must be copied, not written
      // into.
      label: 'with an object value and a dotted key under it',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { applicant: { name: 'B' }, 'applicant.phone': '1' },
        screen: 'page0',
      },
      saves: [
        {
          answers: { applicant: { name: 'B', phone: '1' } },
          applicantActors: [],
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // A field the client sent is never seeded, even when it sent it empty.
      // The empty value is then stripped before saving, so the field is
      // absent rather than holding its default.
      label: 'with an empty value for a field that has a default',
      form: defaultedFieldForm('field0', 'seed'),
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: '' },
        screen: 'page0',
      },
      saves: [{ answers: {}, applicantActors: [] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Sent keys are matched against field ids exactly, so sending the
      // parent object does not count as sending its dotted child field.
      label: 'with only the parent object of a dotted field that has a default',
      form: defaultedFieldForm('applicant.phone', '+354'),
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { applicant: { name: 'B' } },
        screen: 'page0',
      },
      saves: [
        {
          answers: { applicant: { name: 'B', phone: '+354' } },
          applicantActors: [],
        },
      ],
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
        screen: 'page0',
      },
      saves: [
        {
          answers: { field0: 'value' },
          applicantActors: [ACTOR],
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
        screen: 'edp',
      },
      saves: [{ answers: {}, applicantActors: [] }],
      pageId: 'page1',
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
        screen: 'edp',
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
      // The schema sees the cleared field as `''`, so the template's own
      // message is shown rather than the generic one for a missing value.
      label: 'with a cleared required field',
      form: twoPageForm,
      dataSchema: templateRequiredSchema,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: '' },
        screen: 'page0',
      },
      validationErrors: ['field0'],
      validationMessages: [field0Required.defaultMessage],
      saves: [],
      persistingActions: [],
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
        screen: 'edp',
      },
      validationErrors: ['edp'],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'without a screen',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
      },
      rejects: { type: BadRequestException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen no screen has the id of',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        screen: 'nowhere',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen the saved answers hide',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        screen: 'page1',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Whether the screen is shown is judged against the saved answers with
      // the ones in the request.
      label: 'from a screen only the answers in the request show',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { wantsMiddle: 'yes' },
        screen: 'page1',
      },
      saves: [{ answers: { wantsMiddle: 'yes' }, applicantActors: [] }],
      pageId: 'page2',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'to a page the answers in the request show',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { wantsMiddle: 'yes' },
        screen: 'page0',
      },
      saves: [{ answers: { wantsMiddle: 'yes' }, applicantActors: [] }],
      pageId: 'page1',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'past a page the answers in the request hide',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'a' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'a' }, applicantActors: [] }],
      pageId: 'page2',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // There is nothing to advance to, so it stays on the page.
      label: 'from the last shown page',
      form: hideablePageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'hide' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'hide' }, applicantActors: [] }],
      pageId: 'page0',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The provider's result decides which page follows, so the screens are
      // compiled again after it has run.
      label: 'from a data-provider screen whose result shows the next page',
      form: providerGatesPageForm,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        screen: 'edp',
      },
      saves: [{ answers: {}, applicantActors: [] }],
      pageId: 'page1',
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
      label: 'with an answer the role may not write',
      form: twoPageForm,
      write: writesField0,
      application: { answers: { field1: 'stored' } },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value', field1: 'changed' },
        screen: 'page0',
      },
      saves: [
        {
          answers: { field0: 'value', field1: 'stored' },
          applicantActors: [],
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: ['field1'],
      validatorCalls: [['field0', 'value']],
    },
    {
      // The sent dotted key is compared with the stored nested value.
      label: 'with an unchanged nested answer the role may not write',
      form: twoPageForm,
      write: writesField0,
      application: { answers: { applicant: { phone: '1' } } },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'v', 'applicant.phone': '1' },
        screen: 'page0',
      },
      saves: [
        {
          answers: { field0: 'v', applicant: { phone: '1' } },
          applicantActors: [],
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Dropped without a warning, because the value matches the stored one.
      label: 'with an unchanged answer the role may not write',
      form: twoPageForm,
      write: writesField0,
      application: { answers: { field1: 'stored' } },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value', field1: 'stored' },
        screen: 'page0',
      },
      saves: [
        {
          answers: { field0: 'value', field1: 'stored' },
          applicantActors: [],
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: [],
    },
    {
      label: 'with path keys the role may and may not write',
      form: twoPageForm,
      write: { answers: ['applicant'] },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { 'applicant.phone': '1', 'items[0]': 'a' },
        screen: 'page0',
      },
      saves: [
        {
          answers: { applicant: { phone: '1' } },
          applicantActors: [],
        },
      ],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: ['items[0]'],
    },
    {
      label: 'by a role that may write no answers',
      form: twoPageForm,
      write: { externalData: [] },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      saves: [{ answers: {}, applicantActors: [] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: ['field0'],
    },
    {
      label: 'with a default for a field the role may not write',
      form: defaultedFieldForm('field0', 'seed'),
      write: { answers: ['field1'], externalData: [] },
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: {},
        screen: 'page0',
      },
      saves: [{ answers: {}, applicantActors: [] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'by a role the state does not declare',
      form: twoPageForm,
      mappedRole: 'reviewer',
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: { type: ForbiddenException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'by a user with no role',
      form: twoPageForm,
      noRole: true,
      dto: {
        actionType: SdfActionType.NEXT_PAGE,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: { type: ForbiddenException },
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
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'page1' },
      saves: [],
      pageId: 'page0',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // There is nothing before it, so it stays on the page.
      label: 'from the first page',
      form: twoPageForm,
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'page0' },
      saves: [],
      pageId: 'page0',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'past a page the saved answers hide',
      form: conditionalMiddlePageForm,
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'page2' },
      saves: [],
      pageId: 'page0',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'to a page the saved answers show',
      form: conditionalMiddlePageForm,
      application: { answers: { wantsMiddle: 'yes' } },
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'page2' },
      saves: [],
      pageId: 'page1',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Going back saves nothing and decides from the saved answers, not the
      // ones in the request.
      label: 'with answers in the request',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.PREV_PAGE,
        answers: { wantsMiddle: 'yes' },
        screen: 'page2',
      },
      saves: [],
      pageId: 'page0',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'without a screen',
      form: twoPageForm,
      dto: { actionType: SdfActionType.PREV_PAGE },
      rejects: { type: BadRequestException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen no screen has the id of',
      form: twoPageForm,
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'nowhere' },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen the saved answers hide',
      form: conditionalMiddlePageForm,
      dto: { actionType: SdfActionType.PREV_PAGE, screen: 'page1' },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
  ],
  // These rows send a non-default event, so a hardcoded 'SUBMIT' anywhere on
  // the way to changeState shows up.
  [SdfActionType.SUBMIT]: [
    {
      // changeState must get the answers that were just saved.
      label: 'with answers',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'merging with saved answers',
      form: onePageForm,
      application: { answers: savedAnswers() },
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: newAnswers,
        screen: 'page0',
      },
      saves: [{ answers: mergedAnswers }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: mergedAnswers, event: SUBMIT_EVENT }],
    },
    {
      // The request's object must be copied, not written into.
      label: 'with an object value and a dotted key under it',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { applicant: { name: 'B' }, 'applicant.phone': '1' },
        screen: 'page0',
      },
      saves: [{ answers: { applicant: { name: 'B', phone: '1' } } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [
        {
          answers: { applicant: { name: 'B', phone: '1' } },
          event: SUBMIT_EVENT,
        },
      ],
    },
    {
      label: 'by a delegated actor',
      form: onePageForm,
      user: { actor: { nationalId: ACTOR } } as Partial<User>,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'value' }, applicantActors: [ACTOR] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'by a delegated actor, without answers',
      form: onePageForm,
      user: { actor: { nationalId: ACTOR } } as Partial<User>,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'page0',
      },
      saves: [{ applicantActors: [ACTOR] }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: {}, event: SUBMIT_EVENT }],
    },
    {
      label: 'without answers',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: {}, event: SUBMIT_EVENT }],
    },
    {
      // A data-provider screen can be the last one, so SUBMIT runs its
      // providers before the state change. Only those the screen declares.
      label: 'from a data-provider screen',
      form: dataProviderOnlyForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'edp',
      },
      saves: [],
      persistingActions: [
        {
          actions: [providerApi.action],
          event: DefaultEvents.SUBMIT,
          answers: {},
        },
      ],
      ephemeralActions: [],
      // changeState must get the provider's result, which was just saved.
      stateChanges: [
        {
          answers: {},
          event: SUBMIT_EVENT,
          externalData: [providerApi.action],
        },
      ],
    },
    {
      label: 'from a data-provider screen the role may not write',
      form: dataProviderOnlyForm,
      write: { answers: ['field0'] },
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'edp',
      },
      rejects: { type: ForbiddenException, message: /providerAction/ },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen that is not the last',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: {
        type: ConflictException,
        problemType:
          'https://island.is/problems/application-system/sdf/submit-not-on-last-screen',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'without a screen',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
      },
      rejects: { type: BadRequestException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen no screen has the id of',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'nowhere',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen the saved answers hide',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field2: 'value' },
        screen: 'page1',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The answers on the last page are valid, so they are saved before the
      // user is sent to the page that is not.
      label: 'when an earlier screen fails validation',
      form: twoPageForm,
      dataSchema: strictSchema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field1: 'value' },
        screen: 'page1',
      },
      validationErrors: ['field0'],
      pageId: 'page0',
      saves: [{ answers: { field1: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Page 1 is hidden, so its required field does not count.
      label: 'when an earlier screen is hidden by the answers',
      form: conditionalMiddlePageForm,
      dataSchema: field1Schema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field2: 'value' },
        screen: 'page2',
      },
      saves: [{ answers: { field2: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field2: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      // The submitted answers show page 1, so its required field counts.
      label: 'when the answers show an earlier screen that fails validation',
      form: conditionalMiddlePageForm,
      dataSchema: field1Schema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { wantsMiddle: 'yes', field2: 'value' },
        screen: 'page2',
      },
      validationErrors: ['field1'],
      pageId: 'page1',
      saves: [{ answers: { wantsMiddle: 'yes', field2: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Pages 0 and 1 both fail; the user is sent to the first.
      label: 'when several earlier screens fail validation',
      form: conditionalMiddlePageForm,
      dataSchema: field0AndField1Schema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { wantsMiddle: 'yes', field2: 'value' },
        screen: 'page2',
      },
      validationErrors: ['field0'],
      pageId: 'page0',
      saves: [{ answers: { wantsMiddle: 'yes', field2: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The page the user submits from is checked first: its errors come back
      // and nothing is saved, even though page 0 fails too. Page 0 is only
      // reached once this page is valid.
      label: 'when the screen submitted from and an earlier screen both fail',
      form: conditionalMiddlePageForm,
      dataSchema: field0AndField2Schema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: {},
        screen: 'page2',
      },
      validationErrors: ['field2'],
      pageId: 'page2',
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The answers are already saved when the change is noticed.
      label: 'when the state changes during the request',
      form: onePageForm,
      concurrentState: 'completed',
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: {
        type: ConflictException,
        problemType:
          'https://island.is/problems/application-system/sdf/state-changed',
      },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a data-provider screen when the state changes meanwhile',
      form: dataProviderOnlyForm,
      concurrentState: 'completed',
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'edp',
      },
      rejects: {
        type: ConflictException,
        problemType:
          'https://island.is/problems/application-system/sdf/state-changed',
      },
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
      label: 'from the last of two pages',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field1: 'value' },
        screen: 'page1',
      },
      saves: [{ answers: { field1: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field1: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      // Whether the screen is the last is judged against the saved answers with
      // the submitted ones. The saved answers hide page 1, but the submitted
      // ones show it, so page 0 is not the last.
      label: 'from a page the submitted answers no longer make the last',
      form: hideablePageForm,
      application: { answers: { field0: 'hide' } },
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'show' },
        screen: 'page0',
      },
      rejects: {
        type: ConflictException,
        problemType:
          'https://island.is/problems/application-system/sdf/submit-not-on-last-screen',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The saved answers show page 1, but the submitted ones hide it.
      label: 'from a page the submitted answers make the last',
      form: hideablePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'hide' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'hide' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'hide' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'from a data-provider screen when the provider fails',
      form: dataProviderOnlyForm,
      persistingActionResult: providerFailed,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        screen: 'edp',
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
      label: 'that fails validation',
      form: onePageForm,
      dataSchema: strictSchema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: '' },
        screen: 'page0',
      },
      validationErrors: ['field0'],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'with a cleared required field',
      form: onePageForm,
      dataSchema: templateRequiredSchema,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: '' },
        screen: 'page0',
      },
      validationErrors: ['field0'],
      validationMessages: [field0Required.defaultMessage],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'with an answer the role may not write',
      form: onePageForm,
      write: writesField0,
      application: { answers: { other: 'stored' } },
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value', other: 'changed' },
        screen: 'page0',
      },
      saves: [{ answers: { field0: 'value', other: 'stored' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [
        { answers: { field0: 'value', other: 'stored' }, event: SUBMIT_EVENT },
      ],
      droppedChangedKeys: ['other'],
    },
    {
      // Nothing is left to save, but the state change still runs.
      label: 'with only answers the role may not write',
      form: onePageForm,
      write: writesField0,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { other: 'changed' },
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: {}, event: SUBMIT_EVENT }],
      droppedChangedKeys: ['other'],
    },
    // The two rows below document current behaviour: the answers are saved
    // before the state change is attempted, and stay saved when it fails.
    {
      label: 'when the state change fails',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      changeStateResult: {
        hasError: true,
        hasChanged: false,
        error: 'Provider failed',
      },
      rejects: { message: /State transition failed/ },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'when no transition handles the event',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      changeStateResult: {
        hasError: false,
        hasChanged: false,
        hasMatchedTransition: false,
      },
      rejects: { type: ConflictException, problemType: EVENT_NOT_HANDLED },
      saves: [{ answers: { field0: 'value' } }],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [{ answers: { field0: 'value' }, event: SUBMIT_EVENT }],
    },
    {
      label: 'with an event the role may not send',
      form: onePageForm,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: UNPERMITTED_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: { type: ForbiddenException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      eventWarning: UNPERMITTED_EVENT,
    },
    {
      label: 'by a user with no role',
      form: onePageForm,
      noRole: true,
      dto: {
        actionType: SdfActionType.SUBMIT,
        event: SUBMIT_EVENT,
        answers: { field0: 'value' },
        screen: 'page0',
      },
      rejects: { type: ForbiddenException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      eventWarning: SUBMIT_EVENT,
    },
  ],
  [SdfActionType.REFETCH]: [
    {
      label: 'running one of the role actions',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [providerApi.action],
        screen: 'page0',
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
        screen: 'page0',
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
      // An unsaved answer that hides page 1 makes page 0 the last, which is how
      // SUBMIT judges it too, so the footer shows the submit buttons.
      label: 'with an answer that would make the page the last',
      form: hideablePageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'hide' },
        refetchTemplateApiActions: [],
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      footerActionTypes: ['SUBMIT'],
    },
    {
      // What the action fetched is only shown: it does not decide which
      // screens exist, so the screen the user is on stays, without a notice.
      label: 'with fetched data that hides the screen the user is on',
      form: providerHidesPageForm,
      ephemeralStoresResults: true,
      dto: {
        actionType: SdfActionType.REFETCH,
        refetchTemplateApiActions: [providerApi.action],
        screen: 'page1',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [
        {
          actions: [providerApi.action],
          event: SdfActionType.REFETCH,
          answers: {},
        },
      ],
      stateChanges: [],
      pageId: 'page1',
    },
    {
      label: 'requesting an action the role does not have',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: ['notARoleAction'],
        screen: 'page0',
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
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The action runs on the stored value, not the one the role sent.
      label: 'with an answer the role may not write',
      form: twoPageForm,
      write: writesField0,
      application: { answers: { field1: 'stored' } },
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value', field1: 'forged' },
        refetchTemplateApiActions: [providerApi.action],
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [
        {
          actions: [providerApi.action],
          event: SdfActionType.REFETCH,
          answers: { field0: 'value', field1: 'stored' },
        },
      ],
      stateChanges: [],
      droppedChangedKeys: ['field1'],
    },
    {
      label: 'without a screen',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [providerApi.action],
      },
      rejects: { type: BadRequestException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The actions are not run for a screen that is not shown.
      label: 'from a screen no screen has the id of',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { field0: 'value' },
        refetchTemplateApiActions: [providerApi.action],
        screen: 'nowhere',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen the saved answers hide',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: {},
        refetchTemplateApiActions: [],
        screen: 'page1',
      },
      saves: [],
      pageId: 'page0',
      noticeCode: 'screen-unavailable',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The screen shown is the one asked for, not one worked out from the
      // saved page.
      label: 'from the second page',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: {},
        refetchTemplateApiActions: [],
        screen: 'page1',
      },
      saves: [],
      pageId: 'page1',
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      label: 'from a screen only the answers in the request show',
      form: conditionalMiddlePageForm,
      dto: {
        actionType: SdfActionType.REFETCH,
        answers: { wantsMiddle: 'yes' },
        refetchTemplateApiActions: [],
        screen: 'page1',
      },
      saves: [],
      pageId: 'page1',
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
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The value the role may not write never reaches the schema, so the
      // required field is reported as missing.
      label: 'with an answer the role may not write',
      form: twoPageForm,
      dataSchema: templateRequiredSchema,
      write: { answers: ['field1'] },
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { field0: 'value' },
        fieldIds: ['field0'],
        screen: 'page0',
      },
      validationErrors: ['field0'],
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: ['field0'],
    },
    {
      label: 'with answers the role may and may not write',
      form: twoPageForm,
      write: writesField0,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { field0: 'value', field1: 'forged' },
        fieldIds: ['field0', 'field1'],
        screen: 'page0',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      droppedChangedKeys: ['field1'],
      validatorCalls: [['field0', 'value']],
    },
    {
      label: 'without a screen',
      form: twoPageForm,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { field0: 'value' },
        fieldIds: ['field0'],
      },
      rejects: { type: BadRequestException },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // Nothing is validated for a screen that is not shown, even a field that
      // would fail, and there is no notice: the next action says so.
      label: 'for a screen no screen has the id of',
      form: twoPageForm,
      dataSchema: templateRequiredSchema,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { field0: '' },
        fieldIds: ['field0'],
        screen: 'nowhere',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
      validatorCalls: [],
    },
    {
      label: 'for a screen the saved answers hide',
      form: conditionalMiddlePageForm,
      dataSchema: field1Schema,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: {},
        fieldIds: ['field1'],
        screen: 'page1',
      },
      saves: [],
      persistingActions: [],
      ephemeralActions: [],
      stateChanges: [],
    },
    {
      // The answers in the request show the screen, so its field is validated.
      label: 'for a screen only the answers in the request show',
      form: conditionalMiddlePageForm,
      dataSchema: field1Schema,
      dto: {
        actionType: SdfActionType.VALIDATE,
        answers: { wantsMiddle: 'yes' },
        fieldIds: ['field1'],
        screen: 'page1',
      },
      validationErrors: ['field1'],
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
    const template = createTemplate(
      c.form,
      c.dataSchema ?? permissiveSchema,
      c.write ?? 'all',
    )
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      c.noRole
        ? { ...template, mapUserToRole: () => undefined }
        : c.mappedRole
        ? { ...template, mapUserToRole: () => c.mappedRole }
        : template,
    )
    const { controller, applicationService, applicationActionService, logger } =
      buildController(
        row,
        {
          persistingAction: c.persistingActionResult ?? succeeded,
          ephemeralAction: c.ephemeralActionResult ?? succeeded,
          ephemeralStoresResults: c.ephemeralStoresResults,
          changeState: c.changeStateResult ?? transitioned,
        },
        c.concurrentState,
      )
    const requestAnswersBefore = cloneDeep(c.dto.answers)

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
      let errors: ValidationErrorDto[]
      if (c.actionType === SdfActionType.VALIDATE) {
        expect(response).not.toHaveProperty('page')
        errors = (response as ValidateResponseDto).errors
      } else {
        expect(response).toHaveProperty('page')
        errors = (response as ScreenDto).page.errors ?? []
      }
      expect(errors.map((e) => e.componentId)).toEqual(c.validationErrors ?? [])
      if (c.validationMessages) {
        expect(errors.map((e) => e.message)).toEqual(c.validationMessages)
      }
      if (c.screenIndex !== undefined) {
        expect((response as ScreenDto).page.index).toBe(c.screenIndex)
      }
      if (c.pageId !== undefined) {
        expect((response as ScreenDto).page.id).toBe(c.pageId)
      }
      if (c.actionType !== SdfActionType.VALIDATE) {
        expect((response as ScreenDto).notice?.code).toBe(c.noticeCode)
      }
      if (c.footerActionTypes) {
        expect(
          (response as ScreenDto).footer.buttons.map((b) => b.actionType),
        ).toEqual(c.footerActionTypes)
      }
    }

    expect(
      applicationService.update.mock.calls.map(([, data]) => data),
    ).toEqual(c.saves)
    // No action may modify the answers object it received in the request.
    expect(c.dto.answers).toEqual(requestAnswersBefore)
    expect(applicationService.updateExternalData).not.toHaveBeenCalled()
    expect(applicationService.updateApplicationState).not.toHaveBeenCalled()

    expect(
      actionCalls(applicationActionService.performActionOnApplication),
    ).toEqual(c.persistingActions)
    expect(
      actionCalls(applicationActionService.performEphemeralActionOnApplication),
    ).toEqual(c.ephemeralActions)
    expect(
      applicationActionService.changeState.mock.calls.map(([app, , event]) => {
        const { answers, externalData } = app as ApplicationWithAttachments
        const externalDataKeys = Object.keys(externalData ?? {})
        return {
          answers,
          event,
          ...(externalDataKeys.length > 0 && {
            externalData: externalDataKeys,
          }),
        }
      }),
    ).toEqual(c.stateChanges)
    const droppedChangedKeys = c.droppedChangedKeys ?? []
    const droppedWarnings = logger.warn.mock.calls
      .map(([message]) => String(message))
      .filter((message) => message.includes('may not write'))
    expect(droppedWarnings).toEqual(
      droppedChangedKeys.length > 0
        ? [
            expect.stringMatching(
              new RegExp(`: ${escapeRegExp(droppedChangedKeys.join(', '))}$`),
            ),
          ]
        : [],
    )
    if (c.validatorCalls) {
      expect(answerValidator.mock.calls).toEqual(c.validatorCalls)
    }
    const eventWarnings = logger.warn.mock.calls
      .filter(([message]) => String(message).startsWith('Event is not'))
      .map(([, meta]) => (meta as { event: string }).event)
    expect(eventWarnings).toEqual(c.eventWarning ? [c.eventWarning] : [])
  })
})

// A screen request names the screen to show by its id. With no id, or an id
// that no shown screen has, it resumes at the first unanswered page. Nothing is
// saved.
describe('SDF screen request by screen id', () => {
  beforeEach(() => jest.clearAllMocks())

  it.each<{
    label: string
    form: PersistenceCase['form']
    answers: ApplicationRow['answers']
    screen?: string
    pageId: string
    fallsBack: boolean
  }>([
    {
      label: 'shows the screen it is asked for',
      form: twoPageForm,
      answers: {},
      screen: 'page1',
      pageId: 'page1',
      fallsBack: false,
    },
    {
      label: 'resumes at the first unanswered page when no id is given',
      form: twoPageForm,
      answers: { field0: 'value' },
      pageId: 'page1',
      fallsBack: false,
    },
    {
      label: 'resumes when no screen has the id',
      form: twoPageForm,
      answers: {},
      screen: 'nowhere',
      pageId: 'page0',
      fallsBack: true,
    },
    {
      label: 'resumes when the screen is hidden',
      form: hiddenFirstPageForm,
      answers: {},
      screen: 'page0',
      pageId: 'page1',
      fallsBack: true,
    },
    {
      label: 'skips a hidden first page when resuming',
      form: hiddenFirstPageForm,
      answers: {},
      pageId: 'page1',
      fallsBack: false,
    },
  ])('$label', async ({ form, answers, screen, pageId, fallsBack }) => {
    const row = createApplicationRow({ answers })
    getApplicationTemplateByTypeIdMock.mockResolvedValue(
      createTemplate(form, permissiveSchema, 'all'),
    )
    const { controller, applicationService, logger } = buildController(row, {
      persistingAction: succeeded,
      ephemeralAction: succeeded,
      changeState: transitioned,
    })

    const response = await controller.getScreen(row.id, screen, 'is', {
      nationalId: APPLICANT,
    } as User)

    expect(response.page.id).toBe(pageId)
    expect(applicationService.update).not.toHaveBeenCalled()
    expect(
      logger.warn.mock.calls.filter(
        ([message]) => message === 'SDF screen request fell back to resume',
      ),
    ).toEqual(
      fallsBack
        ? [
            [
              'SDF screen request fell back to resume',
              { claimedScreenId: screen },
            ],
          ]
        : [],
    )
  })
})
