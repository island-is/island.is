import { interpret, Event, EventObject, MachineOptions } from 'xstate'
import merge from 'lodash/merge'
import get from 'lodash/get'
import has from 'lodash/has'

import {
  Application,
  ApplicationStatus,
  ExternalData,
  FormValue,
  StaticText,
  FormatMessage,
  ApplicationContext,
  ApplicationRole,
  ApplicationTemplate,
  ApplicationStateMachine,
  ApplicationStateMeta,
  ApplicationStateSchema,
  createApplicationMachine,
  ReadWriteValues,
  RoleInState,
  TemplateApi,
  PendingAction,
  HistoryEventMessage,
} from '@island.is/application/types'
import { formatText } from './formUtils'

export class ApplicationTemplateHelper<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
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
    const applicationTemplateState =
      this.template.stateMachineConfig.states[state]
    if (applicationTemplateState.meta?.status) {
      return applicationTemplateState.meta.status as ApplicationStatus
    } else {
      return ApplicationStatus.DRAFT
    }
  }

  getApplicationActionCardMeta(stateKey: string = this.application.state): {
    title?: StaticText
    description?: StaticText
    tag: { variant?: string; label?: StaticText }
    historyButton?: StaticText
  } {
    const actionCard =
      this.template.stateMachineConfig.states[stateKey]?.meta?.actionCard

    return {
      title: actionCard?.title,
      description: actionCard?.description,
      tag: { variant: actionCard?.tag?.variant, label: actionCard?.tag?.label },
      historyButton: actionCard?.historyButton,
    }
  }

  getApplicationProgress(stateKey: string = this.application.state): number {
    return (
      this.template.stateMachineConfig.states[stateKey]?.meta?.progress ?? 0
    )
  }

  private getTemplateAPIAction(
    action: TemplateApi | TemplateApi[] | null,
  ): TemplateApi | TemplateApi[] | null {
    if (action === null) {
      return null
    }

    return action
  }

  getOnExitStateAPIAction(
    stateKey: string = this.application.state,
  ): TemplateApi | TemplateApi[] | null {
    const action =
      this.template.stateMachineConfig.states[stateKey]?.meta?.onExit ?? null

    return this.getTemplateAPIAction(action)
  }

  getOnEntryStateAPIAction(
    stateKey: string = this.application.state,
  ): TemplateApi | TemplateApi[] | null {
    const action =
      this.template.stateMachineConfig.states[stateKey]?.meta?.onEntry ?? null

    return this.getTemplateAPIAction(action)
  }

  getOnDeleteStateAPIAction(
    stateKey: string = this.application.state,
  ): TemplateApi | TemplateApi[] | null {
    const action =
      this.template.stateMachineConfig.states[stateKey]?.meta?.onDelete ?? null

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
      throw new Error(
        `${eventType} is invalid for state ${initialState.value} for application ${this.application.typeId} with id ${this.application.id}`,
      )
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

  getReadableAnswersAndExternalData(role: ApplicationRole): {
    answers: FormValue
    externalData: ExternalData
  } {
    const returnValue: { answers: FormValue; externalData: ExternalData } = {
      answers: {},
      externalData: {},
    }
    const { answers, externalData } = this.application

    const roleInState = this.getRoleInState(role)
    if (!roleInState) {
      return returnValue
    }
    const { read, write } = roleInState

    if (read === 'all' || write === 'all') {
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
    const roleInState = this.getRoleInState(role)
    if (!roleInState) {
      return undefined
    }
    return roleInState.write
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

  getApisFromRoleInState(role: ApplicationRole): TemplateApi[] {
    const roleInState = this.getRoleInState(role)
    return roleInState?.api ?? []
  }

  getCurrentStatePendingAction(
    application: Application,
    currentRole: ApplicationRole,
    formatMessage: FormatMessage,
    nationalId: string,
    isAdmin: boolean,
    stateKey: string = this.application.state,
  ): PendingAction {
    const stateInfo = this.getApplicationStateInformation(stateKey)

    const pendingAction = stateInfo?.actionCard?.pendingAction

    if (!pendingAction) {
      return {
        displayStatus: 'warning',
      }
    }

    if (typeof pendingAction === 'function') {
      const action = pendingAction(
        application,
        currentRole,
        nationalId,
        isAdmin,
      )
      return {
        displayStatus: action.displayStatus,
        content: action.content
          ? formatText(action.content, application, formatMessage)
          : undefined,
        title: action.title
          ? formatText(action.title, application, formatMessage)
          : undefined,
        button: action.button
          ? formatText(action.button, application, formatMessage)
          : undefined,
      }
    }
    return {
      displayStatus: pendingAction.displayStatus,
      title: pendingAction.title
        ? formatText(pendingAction.title, application, formatMessage)
        : undefined,
      content: pendingAction.content
        ? formatText(pendingAction.content, application, formatMessage)
        : undefined,
      button: pendingAction.button
        ? formatText(pendingAction.button, application, formatMessage)
        : undefined,
    }
  }

  getHistoryLog(
    stateKey: string = this.application.state,
    exitEvent: Event<TEvents>,
  ): HistoryEventMessage | undefined {
    const stateInfo = this.getApplicationStateInformation(stateKey)

    const historyLogs = stateInfo?.actionCard?.historyLogs

    if (Array.isArray(historyLogs)) {
      return historyLogs?.find((historyLog) => historyLog.onEvent === exitEvent)
    } else {
      return historyLogs?.onEvent === exitEvent ? historyLogs : undefined
    }
  }
}
