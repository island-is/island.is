import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationTemplate,
} from '@island.is/application/types'
import {
  AnyEventObject,
  EventObject,
  StateNodeConfig,
  StatesConfig,
} from 'xstate'
import {
  ApplicationBlueprint,
  Events,
  Roles,
  StateBlueprint,
  Transition,
  TransitionConfigOrTarget,
  TransitionsConfig,
} from './templateTypes'
import { z } from 'zod'

export function buildTemplate<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject = Events,
>(
  bluePrint: ApplicationBlueprint,
): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  // 1. Extract data from blueprint
  const { initalState, name, states, ApplicatonType } = bluePrint

  // 2. Build states configuration
  const stateNodes: StatesConfig<TContext, TStateSchema, TEvents> =
    states.reduce((acc: any, state) => {
      acc[state.name] = buildState(state)
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

export function buildState<T extends EventObject = AnyEventObject>(
  stateBlueprint: StateBlueprint,
): StateNodeConfig<ApplicationContext, ApplicationStateSchema<T>, T> {
  const {
    transitions,
    onEntry,
    onExit,
    name,
    status,
    lifecycle,
    form,
    historyLogs,
    pendingAction,
    dataProviders,
  } = stateBlueprint

  return {
    meta: {
      name,
      status,
      lifecycle,
      actionCard: {
        historyLogs,
        pendingAction,
      },
      onExit,
      onEntry,
      roles: [
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
          form,
          api: dataProviders,
          write: 'all',
          delete: true,
        },
      ],
    },
    on: transformTransitions(transitions),
  }
}

function transformTransitions<T extends EventObject>(
  transitions: Transition[],
): TransitionsConfig<unknown, T> {
  const result: { [key: string]: TransitionConfigOrTarget<unknown, T> } = {}

  for (const element of transitions) {
    result[element.event] = { target: element.target }
  }

  return result as TransitionsConfig<unknown, T>
}
