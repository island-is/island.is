import { Event, EventObject, State } from 'xstate'
import { MachineOptions } from 'xstate/lib/types'
import { Application, ExternalData, FormValue } from '../types/Application'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMachine,
  ApplicationStateMeta,
  ApplicationStateSchema,
  createApplicationMachine,
} from '../types/StateMachine'
import { ApplicationTemplate } from '../types/ApplicationTemplate'

export class ApplicationTemplateHelper<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> {
  private readonly application: Application
  private template: ApplicationTemplate<TContext, TStateSchema, TEvents>
  private stateMachine!: ApplicationStateMachine<
    TContext,
    TStateSchema,
    TEvents
  >

  constructor(
    application: Application,
    template: ApplicationTemplate<TContext, TStateSchema, TEvents>,
  ) {
    this.application = application
    this.template = template
  }

  protected initializeStateMachine(
    stateMachineOptions?: Partial<MachineOptions<TContext, TEvents>>,
    initialStateMachineContext?: TContext,
  ) {
    this.stateMachine = createApplicationMachine(
      this.application,
      this.template.stateMachineConfig,
      stateMachineOptions,
      initialStateMachineContext,
    )
  }

  getApplicationStateInformation(
    stateKey: string = this.application.state,
  ): ApplicationStateMeta | undefined {
    return this.template.stateMachineConfig.states[stateKey]?.meta
  }

  changeState(
    event: Event<TEvents>,
  ): State<
    TContext,
    TEvents,
    TStateSchema,
    { value: string; context: TContext }
  > {
    if (!this.stateMachine) {
      this.initializeStateMachine()
    }
    return this.stateMachine.transition(this.application.state, event)
  }

  getPermittedAnswersAndExternalData(
    role: ApplicationRole,
  ): { answers: FormValue; externalData: ExternalData } {
    const returnValue: { answers: FormValue; externalData: ExternalData } = {
      answers: {},
      externalData: {},
    }
    const { answers, externalData } = this.application

    const stateInformation = this.getApplicationStateInformation(
      this.application.state,
    )
    if (!stateInformation) return returnValue

    const roleInState = stateInformation.roles?.find(({ id }) => id === role)
    if (!roleInState) {
      return returnValue
    }
    const { read, write } = roleInState

    if (read === 'all') {
      return { answers, externalData }
    }
    if (write === 'all') {
      return { answers, externalData }
    }

    const answersToPick = [...(write?.answers ?? []), ...(read?.answers ?? [])]
    answersToPick.forEach((answerKey) => {
      returnValue.answers[answerKey] = answers[answerKey]
    })
    const externalDataToPick = [
      ...(write?.externalData ?? []),
      ...(read?.externalData ?? []),
    ]
    externalDataToPick.forEach((dataKey) => {
      returnValue.externalData[dataKey] = externalData[dataKey]
    })
    return returnValue
  }
}
