import {
  ApplicationContext,
  ApplicationStateMeta,
  HistoryEventMessage,
  PendingAction,
  ApplicationRole,
  RoleInState,
  StateLifeCycle,
  Application,
  TemplateApi,
} from '@island.is/application/types'
import type { EventObject } from 'xstate'

type PhaseStatus =
  | 'draft'
  | 'inprogress'
  | 'completed'
  | 'approved'
  | 'rejected'

interface TransitionTarget {
  target: string
  guard?: string
}

type TransitionDef = string | TransitionTarget | TransitionTarget[]

interface PhaseDefinition<TEvent extends EventObject = EventObject, R = unknown> {
  name: string
  status: PhaseStatus
  lifecycle: StateLifeCycle
  progress?: number

  roles?: RoleInState<TEvent, R>[]

  actionCard?: {
    historyLogs?: HistoryEventMessage[] | HistoryEventMessage
    pendingAction?:
      | PendingAction
      | ((
          application: Application,
          role: ApplicationRole,
          nationalId: string,
          isAdmin: boolean,
        ) => PendingAction)
    displayPruneAt?: boolean
  }

  onEntry?: TemplateApi<R>[] | TemplateApi<R>
  onExit?: TemplateApi<R>[] | TemplateApi<R>
  onDelete?: TemplateApi<R>[] | TemplateApi<R>

  entry?: string | string[]
  exit?: string | string[]

  transitions?: Record<string, TransitionDef>
}

type GuardFn = (context: ApplicationContext) => boolean

interface WorkflowDefinition<TEvent extends EventObject = EventObject, R = unknown> {
  initialPhase: string
  phases: Record<string, PhaseDefinition<TEvent, R>>
  guards?: Record<string, GuardFn>
}

interface StateNode<TEvent extends EventObject = EventObject, R = unknown> {
  meta: ApplicationStateMeta<TEvent, R>
  entry?: string | string[]
  exit?: string | string[]
  on?: Record<
    string,
    | string
    | { target: string; cond?: string }
    | Array<{ target: string; cond?: string }>
  >
}

interface WorkflowOutput<TEvent extends EventObject = EventObject, R = unknown> {
  stateMachineConfig: {
    initial: string
    states: Record<string, StateNode<TEvent, R>>
  }
  stateMachineOptions: {
    guards?: Record<string, (context: ApplicationContext) => boolean>
  }
}

const compileTransition = (
  def: TransitionDef,
): string | { target: string; cond?: string } | Array<{ target: string; cond?: string }> => {
  if (typeof def === 'string') {
    return def
  }

  if (Array.isArray(def)) {
    return def.map((t) => ({
      target: t.target,
      ...(t.guard ? { cond: t.guard } : {}),
    }))
  }

  return {
    target: def.target,
    ...(def.guard ? { cond: def.guard } : {}),
  }
}

/**
 * Defines a workflow as a directed graph of phases, compiling to the same
 * `stateMachineConfig` + `stateMachineOptions` shape that XState-based
 * templates use. The output is spread onto an `ApplicationTemplate` object.
 */
export const defineWorkflow = <
  TEvent extends EventObject = EventObject,
  R = unknown,
>(
  definition: WorkflowDefinition<TEvent, R>,
): WorkflowOutput<TEvent, R> => {
  const states: Record<string, StateNode<TEvent, R>> = {}

  for (const [phaseId, phase] of Object.entries(definition.phases)) {
    const meta: ApplicationStateMeta<TEvent, R> = {
      name: phase.name,
      status: phase.status,
      lifecycle: phase.lifecycle,
    }

    if (phase.progress !== undefined) {
      meta.progress = phase.progress
    }

    if (phase.roles) {
      meta.roles = phase.roles
    }

    if (phase.actionCard) {
      meta.actionCard = phase.actionCard
    }

    if (phase.onEntry) {
      meta.onEntry = phase.onEntry
    }

    if (phase.onExit) {
      meta.onExit = phase.onExit
    }

    if (phase.onDelete) {
      meta.onDelete = phase.onDelete
    }

    const stateNode: StateNode<TEvent, R> = { meta }

    if (phase.entry) {
      stateNode.entry = phase.entry
    }

    if (phase.exit) {
      stateNode.exit = phase.exit
    }

    if (phase.transitions) {
      const on: NonNullable<StateNode['on']> = {}
      for (const [event, transitionDef] of Object.entries(phase.transitions)) {
        on[event] = compileTransition(transitionDef)
      }
      stateNode.on = on
    }

    states[phaseId] = stateNode
  }

  const output: WorkflowOutput<TEvent, R> = {
    stateMachineConfig: {
      initial: definition.initialPhase,
      states,
    },
    stateMachineOptions: {},
  }

  if (definition.guards) {
    output.stateMachineOptions.guards = definition.guards
  }

  return output
}
