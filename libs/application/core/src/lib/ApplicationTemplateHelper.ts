import { interpret, Event, EventObject, MachineOptions } from 'xstate'
import merge from 'lodash/merge'
import get from 'lodash/get'
import has from 'lodash/has'

import {
  Application,
  ApplicationStatus,
  ExternalData,
  FormValue,
} from '../types/Application'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMachine,
  ApplicationStateMeta,
  ApplicationStateSchema,
  ApplicationTemplateAPIAction,
  createApplicationMachine,
  ReadWriteValues,
} from '../types/StateMachine'
import { ApplicationTemplate } from '../types/ApplicationTemplate'
import { FormatMessage, StaticText } from '../types/Form'

enum FinalStates {
  REJECTED = 'rejected',
}

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
      merge(stateMachineOptions || {}, this.template.stateMachineOptions),
      stateMachineContext,
    )
  }

  getApplicationStatus(): ApplicationStatus {
    const { state } = this.application

    if (this.template.stateMachineConfig.states[state].type === 'final') {
      if (state === FinalStates.REJECTED) {
        return ApplicationStatus.REJECTED
      }

      return ApplicationStatus.COMPLETED
    }

    return ApplicationStatus.IN_PROGRESS
  }

  getApplicationActionCardMeta(
    stateKey: string = this.application.state,
  ): {
    title?: StaticText
    description?: StaticText
    tag: { variant?: string; label?: StaticText }
  } {
    const actionCard = this.template.stateMachineConfig.states[stateKey]?.meta
      ?.actionCard
    return {
      title: actionCard?.title,
      description: actionCard?.description,
      tag: { variant: actionCard?.tag?.variant, label: actionCard?.tag?.label },
    }
  }

  getApplicationProgress(stateKey: string = this.application.state): number {
    return (
      this.template.stateMachineConfig.states[stateKey]?.meta?.progress ?? 0
    )
  }

  private getTemplateAPIAction(
    action: ApplicationTemplateAPIAction | null,
  ): ApplicationTemplateAPIAction | null {
    if (action === null) {
      return null
    }

    return {
      externalDataId: action.apiModuleAction,
      shouldPersistToExternalData: true,
      throwOnError: true,
      ...action,
    }
  }

  getOnExitStateAPIAction(
    stateKey: string = this.application.state,
  ): ApplicationTemplateAPIAction | null {
    const action =
      this.template.stateMachineConfig.states[stateKey]?.meta?.onExit ?? null

    return this.getTemplateAPIAction(action)
  }

  getOnEntryStateAPIAction(
    stateKey: string = this.application.state,
  ): ApplicationTemplateAPIAction | null {
    const action =
      this.template.stateMachineConfig.states[stateKey]?.meta?.onEntry ?? null

    return this.getTemplateAPIAction(action)
  }

  getApplicationStateInformation(
    stateKey: string = this.application.state,
  ): ApplicationStateMeta<TEvents> | undefined {
    return this.template.stateMachineConfig.states[stateKey]?.meta
  }

  /**
   * Changes the application state
   * @param event A state machine event
   * returns [hasChanged, newState, newApplication] where newApplication has the updated state value
   */
  changeState(event: Event<TEvents>): [boolean, string, Application] {
    this.initializeStateMachine(undefined)

    const service = interpret(
      this.stateMachine,
      this.template.stateMachineOptions,
    )

    const eventType = typeof event === 'object' ? event.type : event
    const { initialState } = service.start()

    if (!initialState.nextEvents.includes(eventType)) {
      throw new Error(`${eventType} is invalid for state ${initialState.value}`)
    }

    service.send(event)

    const state = service.state
    const stateValue = state.value.toString()

    service.stop()

    return [
      Boolean(state.changed),
      stateValue,
      {
        ...state.context.application,
        state: stateValue,
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
    role?: ApplicationRole,
  ): ReadWriteValues | undefined {
    if (!role) {
      return undefined
    }
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

  async applyAnswerValidators(
    newAnswers: FormValue,
    formatMessage: FormatMessage,
  ): Promise<undefined | Record<string, string>> {
    const validators = this.template.answerValidators

    if (!validators) {
      return
    }

    let hasError = false
    const errorMap: Record<string, string> = {}
    const validatorPaths = Object.keys(validators)

    for (const validatorPath of validatorPaths) {
      if (has(newAnswers, validatorPath)) {
        const newAnswer = get(newAnswers, validatorPath)

        const result = await validators[validatorPath](
          newAnswer,
          this.application,
        )

        if (result) {
          hasError = true
          errorMap[result.path] =
            typeof result.message === 'object'
              ? formatMessage(result.message, result.values)
              : result.message
        }
      }
    }

    if (hasError) {
      return errorMap
    }
  }
}
