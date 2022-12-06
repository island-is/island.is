import {
  EventObject,
  Machine,
  Event,
  StateNodeConfig,
  StateSchema,
} from 'xstate'
import { AnyEventObject, MachineOptions, StateMachine } from 'xstate/lib/types'

import { FormLoader, FormText, StaticText } from './Form'
import { Application, ActionCardTag } from './Application'
import { Condition } from './Condition'
import { TestSupport } from '@island.is/island-ui/utils'
import { TemplateApi } from './template-api/TemplateApi'

export type ApplicationRole = 'applicant' | 'assignee' | string

export enum DefaultEvents {
  PAYMENT = 'PAYMENT',
  APPROVE = 'APPROVE',
  ASSIGN = 'ASSIGN',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  ABORT = 'ABORT',
  EDIT = 'EDIT',
}

export type ReadWriteValues =
  | 'all'
  | {
      answers?: string[]
      externalData?: string[]
    }
export interface RoleInState<
  T extends EventObject = AnyEventObject,
  R = unknown
> {
  id: ApplicationRole
  read?: ReadWriteValues
  write?: ReadWriteValues
  delete?: boolean
  formLoader?: FormLoader
  actions?: CallToAction<T>[]
  shouldBeListedForRole?: boolean
  api?: TemplateApi<R>[]
}

export interface ApplicationContext {
  application: Application
}

export type CallToAction<T extends EventObject = AnyEventObject> = {
  event: Event<T> | string
  name: FormText
  type: 'primary' | 'subtle' | 'reject' | 'sign'
  condition?: Condition
} & TestSupport

export type StateLifeCycle =
  | {
      // Controls visibility from my pages + /umsoknir/:type when in current state
      shouldBeListed: boolean
      shouldBePruned: false
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null
    }
  | {
      shouldBeListed: boolean
      shouldBePruned: true
      // If set to a number prune date will equal current timestamp + whenToPrune (ms)
      whenToPrune: number | ((application: Application) => Date)
      shouldDeleteChargeIfPaymentFulfilled?: boolean | null
    }

export interface ApplicationStateMeta<
  T extends EventObject = AnyEventObject,
  R = unknown
> {
  name: string
  lifecycle: StateLifeCycle
  actionCard?: {
    title?: StaticText
    description?: StaticText
    tag?: { label?: StaticText; variant?: ActionCardTag }
  }
  progress?: number
  /**
   * Represents the current status of the application in the state, defaults to draft
   */
  status: 'approved' | 'rejected' | 'draft' | 'completed' | 'inprogress'
  roles?: RoleInState<T>[]
  onExit?: TemplateApi<R>
  onEntry?: TemplateApi<R>
}

export interface ApplicationStateSchema<T extends EventObject = AnyEventObject>
  extends StateSchema {
  meta: ApplicationStateMeta<T>
  states: {
    [key: string]: ApplicationStateSchema<T>
  }
}

export type ApplicationStateMachine<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> = StateMachine<TContext, TStateSchema, TEvents>

// manually overwrites the initial state for the template as well so the interpreter starts in the current application state
export function createApplicationMachine<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvent>,
  TEvent extends EventObject = AnyEventObject
>(
  application: Application,
  config: StateNodeConfig<TContext, TStateSchema, TEvent>,
  options?: Partial<MachineOptions<TContext, TEvent>>,
  initialContext?: TContext,
): ApplicationStateMachine<TContext, TStateSchema, TEvent> {
  const context = initialContext
    ? { ...initialContext, application }
    : { application }

  const applicationState = application.state
  // validate that applicationState is part of the states config, if that fails, use the default initial state?
  let initialState = config.initial
  if (config?.states && config.states[applicationState]) {
    initialState = applicationState
  }

  return Machine(
    { ...config, initial: initialState },
    options ?? {},
    context as TContext,
  )
}
