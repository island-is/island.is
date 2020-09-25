import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  DataProvider,
  Schema,
} from '@island.is/application/template'
import { EventObject, MachineConfig } from 'xstate'
import { StatesConfig } from 'xstate/lib/types'

export interface ApplicationTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> {
  readonly type: ApplicationTypes
  readonly dataSchema: Schema
  readonly dataProviders: DataProvider[]
  readonly stateMachineConfig: MachineConfig<
    TContext,
    TStateSchema,
    TEvents
  > & {
    states: StatesConfig<TContext, TStateSchema, TEvents>
  }
  mapUserToRole(id: string, state: string): ApplicationRole
}
