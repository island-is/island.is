import {
  interpret,
  Event,
  EventObject,
  MachineOptions,
  ServiceConfig,
  InvokeMeta,
} from 'xstate'
import { Application, ExternalData, FormValue } from '../types/Application'
import merge from 'lodash/merge'

import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMachine,
  ApplicationStateMeta,
  ApplicationStateSchema,
  createApplicationMachine,
  ReadWriteValues,
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

  private initializeStateMachine(
    stateMachineContext?: TContext,
    stateMachineOptions?: Partial<MachineOptions<TContext, TEvents>>,
  ) {
    this.stateMachine = createApplicationMachine(
      this.application,
      this.template.stateMachineConfig,
      merge(stateMachineOptions, this.template.stateMachineOptions),
      stateMachineContext,
    )
  }

  getApplicationProgress(stateKey: string = this.application.state): number {
    return (
      this.template.stateMachineConfig.states[stateKey]?.meta?.progress ?? 0
    )
  }

  getApplicationStateInformation(
    stateKey: string = this.application.state,
  ): ApplicationStateMeta | undefined {
    return this.template.stateMachineConfig.states[stateKey]?.meta
  }

  /***
   * Changes the application state
   * @param event A state machine event
   * returns [hasChanged, newState, newApplication] where newApplication has the updated state value
   */
  changeState(
    event: Event<TEvents>,
    emailService: any,
  ): [boolean, string, Application] {
    this.initializeStateMachine(undefined, {
      services: {
        emailService: async (
          context: TContext,
          event: TEvents,
          { src }: InvokeMeta,
        ) => {
          const template = src.template(context)
          return emailService.sendEmail(template)
        },
      },
    })
    const service = interpret(
      this.stateMachine,
      this.template.stateMachineOptions,
    )
    service.start()
    service.send(event)

    const newState = service.state
    service.stop()
    const newApplicationState = newState.value.toString()
    return [
      Boolean(newState.changed),
      newApplicationState,
      {
        ...newState.context.application,
        state: newApplicationState,
      },
    ]
  }

  getReadableAnswersAndExternalData(
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
  getWritableAnswersAndExternalData(
    role: ApplicationRole,
  ): ReadWriteValues | undefined {
    const stateInformation = this.getApplicationStateInformation(
      this.application.state,
    )
    if (!stateInformation) return undefined

    const roleInState = stateInformation.roles?.find(({ id }) => id === role)
    if (!roleInState) {
      return undefined
    }
    return roleInState.write
  }
}
