import { interpret, Event, EventObject, MachineOptions } from 'xstate'
import merge from 'lodash/merge'
import get from 'lodash/get'
import has from 'lodash/has'
import { ApplicationTemplateAPIAction } from '@island.is/application/core'

import {
  Application,
  ApplicationStatus,
  ExternalData,
  FormValue,
} from '../types/Application'
import { FormatMessage } from '../types/external'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateMachine,
  ApplicationStateMeta,
  ApplicationStateSchema,
  createApplicationMachine,
  ReadWriteValues,
  RoleInState,
} from '../types/StateMachine'
import { ApplicationTemplate } from '../types/ApplicationTemplate'
import { StaticText } from '../types/Form'

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
    roles: ApplicationRole | ApplicationRole[],
  ): { answers: FormValue; externalData: ExternalData } {
    const returnValue: { answers: FormValue; externalData: ExternalData } = {
      answers: {},
      externalData: {},
    }
    const { answers, externalData } = this.application
    if (typeof roles === 'string') {
      roles = [roles]
    }
    for (const role in roles) {
      const roleInState = this.getRoleInState(roles[role])
      if (!roleInState) {
        continue
      }
      const { read, write } = roleInState

      if (read === 'all' || write === 'all') {
        return { answers, externalData }
      }

      const answersToPick = [
        ...(write?.answers ?? []),
        ...(read?.answers ?? []),
      ]
      answersToPick.forEach((answerKey) => {
        // if answer already in return value skip it
        if (!returnValue.answers[answerKey]) {
          returnValue.answers[answerKey] = answers[answerKey]
        }
      })
      const externalDataToPick = [
        ...(write?.externalData ?? []),
        ...(read?.externalData ?? []),
      ]
      externalDataToPick.forEach((dataKey) => {
        // if data already in return value skip it
        if (!returnValue.externalData[dataKey]) {
          returnValue.externalData[dataKey] = externalData[dataKey]
        }
      })
    }

    return returnValue
  }

  getWritableAnswersAndExternalData(
    roles?: ApplicationRole | ApplicationRole[],
  ): ReadWriteValues | undefined {
    if (!roles) {
      return undefined
    }
    if (Array.isArray(roles)) {
      const answerReturnValue: string[] = []
      const externalDataReturnValue: string[] = []
      for (const role in roles) {
        const roleInState = this.getRoleInState(roles[role])
        if (!roleInState) {
          continue
        }
        const roleWrite = roleInState.write
        if (!roleWrite) {
          continue
        }
        if (roleWrite === 'all') {
          return 'all'
        }
        if (roleWrite.answers) {
          roleWrite.answers.forEach((answerKey) => {
            if (!answerReturnValue.includes(answerKey)) {
              answerReturnValue.push(answerKey)
            }
          })
        }
        if (roleWrite.externalData) {
          roleWrite.externalData.forEach((externalDataKey) => {
            if (!externalDataReturnValue.includes(externalDataKey)) {
              externalDataReturnValue.push(externalDataKey)
            }
          })
        }
      }
      return {
        answers: answerReturnValue,
        externalData: externalDataReturnValue,
      }
    } else {
      const roleInState = this.getRoleInState(roles)
      if (!roleInState) {
        return undefined
      }
      return roleInState.write
    }
  }

  getRoleInState(role: ApplicationRole): RoleInState<TEvents> | undefined {
    const stateInformation = this.getApplicationStateInformation(
      this.application.state,
    )
    if (!stateInformation) return undefined

    return stateInformation.roles?.find(({ id }) => id === role)
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
