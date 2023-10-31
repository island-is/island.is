import {
  buildDataProviderItem,
  buildPaymentChargeOverviewField,
  buildSection,
  buildSubmitField,
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMachineStatus,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DataProviderBuilderItem,
  DataProviderItem,
  DefaultEvents,
  FormItemTypes,
  FormModes,
  HistoryEventMessage,
  InstitutionNationalIds,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  PendingAction,
  RoleInState,
  StateLifeCycle,
  TemplateApi,
  UserProfileApi,
  ValidateCriminalRecordApi,
} from '@island.is/application/types'
import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  StatesConfig,
  TransitionsConfig,
} from 'xstate'

import { z } from 'zod'

import { completedData, data } from './states'
import { ChargeItemCode } from '@island.is/shared/constants'

export interface ApplicationBlueprint {
  ApplicatonType: ApplicationTypes
  initalState: string
  name: string
  states: StateBlueprint[]
  dataProviders: TemplateApi[] //TODO: maybe later map these to the state nodes but for now just limit to just the prerequisites state
}

export interface Transition {
  target: string
  event: string
}

export interface StateBlueprint {
  name: string
  form: string
  transitions: Transition[]
  status: ApplicationStateMachineStatus
  lifecycle: StateLifeCycle
  pendingAction?: PendingAction
  historyLogs?: HistoryEventMessage[] | HistoryEventMessage
  onEntry?: TemplateApi[] | TemplateApi
  onExit?: TemplateApi[] | TemplateApi
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export function buildTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(
  bluePrint: ApplicationBlueprint,
): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  // 1. Extract data from blueprint
  const { initalState, name, states, ApplicatonType, dataProviders } = bluePrint

  // 2. Build states configuration
  const stateNodes: StatesConfig<TContext, TStateSchema, TEvents> =
    states.reduce((acc: any, state) => {
      acc[state.name] = {
        meta: {
          name: state.name,
          status: state.status,
          lifecycle: state.lifecycle,
          onEntry: state.onEntry,
          onExit: state.onExit,
          actionCard: {
            historyLogs: state.historyLogs,
            pendingAction: state.pendingAction,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'm.payUp',
                  type: 'primary',
                },
              ],
              form: state.form,
              write: 'all',
              read: 'all',
              api: dataProviders, //TODO: limit to just the prerequisites state
              delete: true,
            },
          ],
        },
        on: buildTransitions(state.transitions),
      }
      return acc as ApplicationStateMeta<TEvents>
    }, {} as StatesConfig<TContext, TStateSchema, TEvents>)

  const Schema = z.object({
    approveExternalData: z.boolean().refine((v) => v),
  })

  // 3. Create template configuration
  return {
    type: ApplicatonType, // Assuming the blueprint name is the application type
    name: name,
    institution: 'Stafrænt ísland',
    dataSchema: Schema,
    translationNamespaces: [
      '', //TODO get the namespace from the blueprint
    ],
    stateMachineConfig: {
      initial: initalState,
      states: stateNodes,
    },
    mapUserToRole(
      id: string,
      application: Application,
    ): ApplicationRole | undefined {
      if (id === application.applicant) {
        return Roles.APPLICANT
      }
      return undefined
    },
  }
}

function buildTransitions<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(transitions: Transition[]): TransitionsConfig<TContext, Events> {
  return transitions.reduce((acc: any, transition) => {
    acc[transition.event] = transition.target
    return acc
  }, {} as TransitionsConfig<TContext, Events>)
}

/**
 * Configuration options for creating a payment state.
 *
 * @template T The event object type.
 * @template R The return type.
 */
type StateConfigOptions<T extends EventObject = AnyEventObject, R = unknown> = {
  /** The target state if the payment process is aborted. Defaults to 'draft'. */
  abortTarget?: string

  /** The lifecycle duration of the payment state. */
  lifecycle?: StateLifeCycle

  /** Functions to call when exiting the payment state. */
  onExit?: TemplateApi<R>[]

  /** Functions to call when entering the payment state. */
  onEntry?: TemplateApi<R>[]

  /** Roles associated with the payment state.  Defaults to a single role Roles.APPLICANT */
  roles?: RoleInState<T>[]

  /**
   * The target state after the payment is submitted.
   * This can be a string representing the target state, or an array
   * of target objects with optional conditions. Defaults to 'done'.
   */
  submitTarget?:
    | {
        target: string
        cond?: (context: ApplicationContext) => boolean
      }[]
    | string
}

export function buildState<T extends EventObject = AnyEventObject, R = unknown>(
  options: StateConfigOptions<T, R>,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> {
  const { onExit, onEntry } = options
  let submitTransitions: Array<{
    target: string
    cond?: (context: ApplicationContext) => boolean
  }> = []

  if (typeof options.submitTarget === 'string') {
    submitTransitions = [{ target: options.submitTarget }]
  } else if (options.submitTarget && Array.isArray(options.submitTarget)) {
    submitTransitions = options.submitTarget.map((targetObj) => {
      if (targetObj.cond) {
        return {
          target: targetObj.target,
          cond: targetObj.cond,
        }
      }
      return {
        target: targetObj.target,
      }
    })
  }
  submitTransitions =
    submitTransitions.length < 1 ? [{ target: 'done' }] : submitTransitions
  const transitions = {
    [DefaultEvents.SUBMIT]: [...submitTransitions],
    [DefaultEvents.ABORT]: { target: options.abortTarget || 'draft' },
  } as TransitionsConfig<ApplicationContext, T>

  return {
    meta: {
      name: 'Greiðsla',
      status: 'inprogress',
      lifecycle: options.lifecycle || pruneAfterDays(1),
      actionCard: {
        historyLogs: [
          {
            logMessage: coreHistoryMessages.paymentAccepted,
            onEvent: DefaultEvents.SUBMIT,
          },
          {
            logMessage: coreHistoryMessages.paymentCancelled,
            onEvent: DefaultEvents.ABORT,
          },
        ],
        pendingAction: {
          title: corePendingActionMessages.paymentPendingTitle,
          content: corePendingActionMessages.paymentPendingDescription,
          displayStatus: 'warning',
        },
      },
      ...(onExit || []),
      ...(onEntry || []),
      roles: options.roles || [
        {
          id: 'applicant',
          actions: [
            { event: 'SUBMIT', name: 'Panta', type: 'primary' },
            {
              event: 'ABORT',
              name: 'Hætta við',
              type: 'primary',
            },
          ],
          write: 'all',
          delete: true,
        },
      ],
    },
    on: transitions,
  }
}

export function buildCertificateTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
>(
  name: string,
  certificateProvider: DataProviderBuilderItem,
  getPdfApi: TemplateApi,
  templateId: ApplicationTypes,
  title: string,
): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  const dataString: string = JSON.stringify(data)
  const completedDataString: string = JSON.stringify(completedData)

  const providers = [
    buildDataProviderItem({
      provider: NationalRegistryUserApi,
      title: 'Persónuupplýsingar úr Þjóðskrá',
      subTitle:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    }),
    buildDataProviderItem({
      provider: UserProfileApi,
      title: 'Netfang og símanúmer úr þínum stillingum',
      subTitle:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    }),
    buildDataProviderItem(certificateProvider),
    buildDataProviderItem({
      provider: PaymentCatalogApi.configure({
        params: {
          organizationId: InstitutionNationalIds.SYSLUMENN,
        },
      }),
      title: '',
    }),
  ]

  const generatePayment = (title: string): string => {
    const payment = {
      id: 'SampleFormId',
      title: title,
      mode: FormModes.DRAFT,
      type: FormItemTypes.FORM,
      renderLastScreenBackButton: true,
      renderLastScreenButton: true,
      children: [
        buildSection({
          id: 'section',
          title: 'Greiðsla',
          children: [
            {
              id: 'multifield_payment_approval',
              title: 'Greiðsla',
              type: FormItemTypes.MULTI_FIELD,
              children: [
                buildPaymentChargeOverviewField({
                  id: 'paymentChargeOverviewField',
                  chargeItemCode: ChargeItemCode.CRIMINAL_RECORD,
                  title: '',
                }),
                buildSubmitField({
                  id: 'submit2',
                  title: 'Greiðslu upplýsingar',
                  refetchApplicationAfterSubmit: true,
                  placement: 'footer',
                  actions: [
                    { event: 'SUBMIT', name: 'Confirm', type: 'primary' },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }
    return JSON.stringify(payment)
  }

  const generateCompleted = (title: string): string => {
    const completed = {
      id: 'SampleFormId',
      title: title,
      mode: 'draft',
      type: 'FORM',
      renderLastScreenBackButton: false,
      renderLastScreenButton: false,
      children: [
        {
          id: 'section1',
          title: 'Umsókn send inn!',
          type: 'SECTION',
          children: [
            {
              id: 'multifield1',
              title: title,
              type: 'MULTI_FIELD',
              children: [
                {
                  id: 'pdfViewer',
                  title: 'PDF viewer',
                  type: 'PDF_VIEWER',
                  children: null,
                  component: 'PdfViewerFormField',
                  pdfKey: 'criminalRecord.data.contentBase64',
                },
              ],
            },
          ],
        },
      ],
    }
    return JSON.stringify(completed)
  }

  function generatePrerequisites(
    dataProviders: DataProviderItem[],
    title: string,
  ): string {
    const prerequisites = {
      id: 'SampleFormId',
      title: title,
      mode: 'notstarted',
      type: 'FORM',
      renderLastScreenBackButton: true,
      renderLastScreenButton: true,
      children: [
        {
          id: 'section1',
          title: 'Gagnaöflun',
          type: 'SECTION',
          children: [
            {
              id: 'approveExternalData',
              title: 'Utanaðkomandi gögn',
              type: 'EXTERNAL_DATA_PROVIDER',
              isPartOfRepeater: false,
              children: null,
              submitField: {
                id: 'submit2',
                title: 'Submit Title',
                type: 'SUBMIT',
                placement: 'footer',
                children: null,
                doesNotRequireAnswer: true,
                component: 'SubmitFormField',
                actions: [
                  {
                    event: 'SUBMIT',
                    name: 'Samþykkja',
                    type: 'primary',
                  },
                ],
                refetchApplicationAfterSubmit: true,
              },
              dataProviders: dataProviders,
            },
          ],
        },
      ],
    }
    return JSON.stringify(prerequisites)
  }

  const blueprint: ApplicationBlueprint = {
    ApplicatonType: templateId,
    initalState: 'prerequisites',
    name: name,
    dataProviders: [
      PaymentCatalogApi,
      UserProfileApi,
      NationalRegistryUserApi,
      ValidateCriminalRecordApi,
    ],
    states: [
      {
        name: 'prerequisites',
        status: 'draft',
        form: generatePrerequisites(providers, title),
        transitions: [{ event: 'SUBMIT', target: 'draft' }],
        historyLogs: {
          onEvent: 'SUBMIT',
          logMessage: 'Umsókn hafin',
        },
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: false,
        },
      },
      {
        name: 'draft',
        status: 'draft',
        form: generatePayment(title),
        transitions: [{ event: 'SUBMIT', target: 'completed' }],
        historyLogs: {
          onEvent: 'SUBMIT',
          logMessage: 'Greiðsla móttekin.',
        },
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 1 * 24 * 3600 * 1000,
        },
      },
      {
        name: 'completed',
        status: 'completed',
        form: generateCompleted(title),
        transitions: [{ event: 'SUBMIT', target: 'completed' }],
        pendingAction: {
          displayStatus: 'success',
          title: 'Vottord afhent',
          content: 'Vottord aðgengilegt í umsókn og á mínum síðum',
        },
        onEntry: [getPdfApi],
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 1 * 24 * 3600 * 1000,
        },
      },
    ],
  }
  return buildTemplate(blueprint)
}
