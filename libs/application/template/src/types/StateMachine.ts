import {
  EventObject,
  Machine,
  Event,
  StateNodeConfig,
  StateSchema,
} from 'xstate'
import { AnyEventObject, MachineOptions, StateMachine } from 'xstate/lib/types'
import { Form } from './Form'
import { Application } from './Application'

export type ApplicationRole = 'applicant' | 'reviewer' | string

export interface RoleInState<T extends EventObject = AnyEventObject> {
  id: ApplicationRole
  read?:
    | 'all'
    | {
        answers?: string[]
        externalData?: string[]
      }
  write?:
    | 'all'
    | {
        answers?: string[]
        externalData?: string[]
      }
  formLoader?: () => Promise<Form>
  actions?: CallToAction<T>[]
}

export interface ApplicationContext {
  application: Application
}

export type CallToAction<T extends EventObject = AnyEventObject> = {
  event: Event<T> | string
  name: string
  type: 'primary' | 'subtle' | 'reject' | string
}

export interface ApplicationStateMeta<T extends EventObject = AnyEventObject> {
  name: string
  roles?: RoleInState<T>[]
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
  return Machine(config, options ?? {}, context as TContext)
}
