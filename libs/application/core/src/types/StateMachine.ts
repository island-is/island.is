import {
  EventObject,
  Machine,
  Event,
  StateNodeConfig,
  StateSchema,
} from 'xstate'
import { AnyEventObject, MachineOptions, StateMachine } from 'xstate/lib/types'
import { Form, FormText } from './Form'
import { Application } from './Application'

export type ApplicationRole = 'applicant' | 'assignee' | string

export enum DefaultEvents {
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

export interface RoleInState<T extends EventObject = AnyEventObject> {
  id: ApplicationRole
  read?: ReadWriteValues
  write?: ReadWriteValues
  formLoader?: () => Promise<Form>
  actions?: CallToAction<T>[]
}

export interface ApplicationContext {
  application: Application
}

export type CallToAction<T extends EventObject = AnyEventObject> = {
  event: Event<T> | string
  name: FormText
  type: 'primary' | 'subtle' | 'reject' | string
}

export interface ApplicationStateMetaOnEntry<
  T extends EventObject = AnyEventObject
> {
  // Name of the action that will be run on the API
  // these actions are exported from template source as:
  // export const getAPIModule = () => import('./apiModule/')
  apiModuleAction: string
  onSuccessEvent?: T[keyof T]
  onErrorEvent?: T[keyof T]
}

export interface ApplicationStateMeta<T extends EventObject = AnyEventObject> {
  name: string
  progress?: number
  roles?: RoleInState<T>[]
  onEntry?: ApplicationStateMetaOnEntry<T>
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
