import {
  ApplicationContext,
  ApplicationStateMachineStatus,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  HistoryEventMessage,
  PendingAction,
  StateLifeCycle,
  TemplateApi,
} from '@island.is/application/types'
import {
  ApplicationBlueprint,
  Events,
  StateBlueprint,
  Transition,
} from './templateTypes'
import { EventObject } from 'xstate'
import { buildTemplate } from './templateBuilder'

export class ApplicationBuilder<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
> {
  templateDefinition: ApplicationBlueprint

  constructor(
    name: string,
    applicatonType: ApplicationTypes,
    initialState?: string,
  ) {
    this.templateDefinition = {
      ApplicatonType: applicatonType,
      initalState: initialState ?? 'prerequisites',
      name: name,
      states: [],
    }
  }

  addState(state: ApplicationStateBuilder) {
    this.templateDefinition.states.push(state.build())
    return this
  }

  build(): ApplicationTemplate<TContext, TStateSchema, TEvents> {
    return buildTemplate(this.templateDefinition)
  }
}

export class ApplicationStateBuilder {
  private stateDefinition: StateBlueprint

  constructor(
    name: string,
    status: ApplicationStateMachineStatus,
    form?: string,
    transition?: Transition,
  ) {
    this.stateDefinition = {
      name: name,
      form: form ?? '',
      transitions: transition ? [transition] : [],
      status,
      lifecycle: {
        shouldBeListed: true,
        shouldBePruned: true,
        whenToPrune: 1 * 24 * 3600 * 1000,
      },
      historyLogs: [],
      dataProviders: [],
    }
  }

  public get name(): string {
    return this.stateDefinition.name
  }

  setForm(form: string) {
    this.stateDefinition.form = form
    return this
  }

  lifecycle(lifecycle: StateLifeCycle) {
    this.stateDefinition.lifecycle = lifecycle
    return this
  }

  addTransition(event: DefaultEvents, target: string) {
    this.stateDefinition.transitions.push({ event, target })
    return this
  }

  addHistoryLog(historyLog: HistoryEventMessage) {
    if (Array.isArray(this.stateDefinition.historyLogs)) {
      this.stateDefinition.historyLogs.push(historyLog)
    }
    return this
  }

  apis(...apis: TemplateApi[]) {
    if (!Array.isArray(this.stateDefinition.dataProviders)) {
      this.stateDefinition.dataProviders = []
    }
    this.stateDefinition.dataProviders = [
      ...this.stateDefinition.dataProviders,
      ...apis,
    ]
    return this
  }

  addOnEntry(onEntry: TemplateApi) {
    if (!Array.isArray(this.stateDefinition.onEntry)) {
      this.stateDefinition.onEntry = []
    }
    this.stateDefinition.onEntry.push(onEntry)
    return this
  }

  addOnExit(onExit: TemplateApi) {
    if (!Array.isArray(this.stateDefinition.onExit)) {
      this.stateDefinition.onExit = []
    }
    this.stateDefinition.onExit.push(onExit)
    return this
  }

  addPendingAction(pendingAction: PendingAction) {
    this.stateDefinition.pendingAction = pendingAction
    return this
  }

  private validate() {
    const errors: string[] = []

    const { name, status, form, transitions, historyLogs, lifecycle } =
      this.stateDefinition

    // Rule 1: Every state should have a form.
    if (!form) {
      errors.push(`State "${name}" must have a form.`)
    }

    // Rule 2: If the status is not completed, it should have at least one transition.
    if (status !== 'completed' && transitions.length === 0) {
      errors.push(
        `State "${name}" with the status "${status}" must have at least one transition.`,
      )
    }

    // Rule 3: The state should have a lifecycle defined.
    if (!lifecycle) {
      errors.push(`State "${name}" must have a lifecycle defined.`)
    }

    // Rule 4: The state should have at least one history log.
    if (!historyLogs) {
      errors.push(`State "${name}" must have at least one history log.`)
    }

    if (errors.length > 0) {
      throw new Error(
        `Validation failed for state "${name}":\n` + errors.join('\n'),
      )
    }
  }

  build() {
    this.validate()
    return this.stateDefinition
  }
}

export function applicationBuilder<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
>(
  name: string,
  applicatonType: ApplicationTypes,
  initialState?: string,
): ApplicationBuilder<TContext, TStateSchema, TEvents> {
  return new ApplicationBuilder(name, applicatonType, initialState)
}

export const state = (
  name: string,
  status: ApplicationStateMachineStatus,
  form?: string,
  transition?: Transition,
): ApplicationStateBuilder => {
  return new ApplicationStateBuilder(name, status, form, transition)
}
