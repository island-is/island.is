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

interface PhaseDefinition<R = unknown> {
  name: string
  status: PhaseStatus
  lifecycle: StateLifeCycle
  progress?: number

  roles?: RoleInState<EventObject, R>[]

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

interface WorkflowDefinition<R = unknown> {
  initialPhase: string
  phases: Record<string, PhaseDefinition<R>>
  guards?: Record<string, GuardFn>
}

interface StateNode {
  meta: ApplicationStateMeta<EventObject, unknown>
  entry?: string | string[]
  exit?: string | string[]
  on?: Record<
    string,
    | string
    | { target: string; cond?: string }
    | Array<{ target: string; cond?: string }>
  >
}

interface WorkflowOutput {
  stateMachineConfig: {
    initial: string
    states: Record<string, StateNode>
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
export const defineWorkflow = <R = unknown>(
  definition: WorkflowDefinition<R>,
): WorkflowOutput => {
  const states: Record<string, StateNode> = {}

  for (const [phaseId, phase] of Object.entries(definition.phases)) {
    const meta: ApplicationStateMeta<EventObject, R> = {
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

    const stateNode: StateNode = { meta }

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

  const output: WorkflowOutput = {
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
