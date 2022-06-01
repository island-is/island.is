import {
  Application,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  ApplicationTemplateAPIAction,
  ApplicationWithAttachments,
  ExternalData,
  PerformActionResult,
} from '@island.is/application/core'
import { TemplateAPIService } from '@island.is/application/template-api-modules'
import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
@Injectable()
export class TemplateApiActionRunner {
  private application: ApplicationWithAttachments = {} as ApplicationWithAttachments
  private auth: User = {} as User
  private oldExternalData: ExternalData = {}
  private newExternalData: ExternalData = {}

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
  ) {}

  /**
   * Runs api actions for a given application.
   * Actions can be run sequentially or in parallel.
   * Each action with the same order number is run in parallel.
   * Else the actions are run sequentially ascending by order.
   * Actions with no order are run last in parallel.
   * Application is then updated with new external data from each action with persistToExternalData set to true
   * @param application
   * @param actions
   * @param auth
   * @returns Updated application
   */
  async run(
    application: ApplicationWithAttachments,
    actions: ApplicationTemplateAPIAction[],
    auth: User,
  ): Promise<ApplicationWithAttachments> {
    this.application = application
    this.auth = auth
    this.oldExternalData = application.externalData

    const groupedActions = this.groupByOrder(
      this.sortAndSetUndefinedOrderToZero(actions),
    )
    await this.runActions(groupedActions)

    await this.persistExternalData(actions)

    return this.application
  }

  sortAndSetUndefinedOrderToZero(actions: ApplicationTemplateAPIAction[]) {
    const defaultsToZero = actions.map((action) => {
      if (!action.order) {
        action.order = 0
      }
      return action
    })

    const sortedActions = defaultsToZero.sort((a, b) => {
      if (a.order === undefined) {
        return 1
      }
      if (b.order === undefined) {
        return -1
      }
      return a.order - b.order
    })

    return sortedActions
  }

  groupByOrder(
    actions: ApplicationTemplateAPIAction[],
  ): ApplicationTemplateAPIAction[][] {
    const groupedActions = actions.reduce((acc, action) => {
      const order = action.order ?? 0
      if (!acc[order]) {
        acc[order] = []
      }
      acc[order].push(action)
      return acc
    }, {} as { [key: number]: ApplicationTemplateAPIAction[] })

    const result = Object.keys(groupedActions).map(
      (value: string): ApplicationTemplateAPIAction[] => {
        return groupedActions[(value as unknown) as number]
      },
    )

    return result
  }

  async runActions(actionGroups: ApplicationTemplateAPIAction[][]) {
    const result = actionGroups.reduce((accumulatorPromise, actions) => {
      return accumulatorPromise.then(() => {
        const ps = Promise.all(
          actions.map((action) => this.callProvider(action)),
        )
        return ps.then(() => {
          return
        })
      })
    }, Promise.resolve())

    await result
  }

  async callProvider(action: ApplicationTemplateAPIAction) {
    const { apiModuleAction, externalDataId, mockData, namespace } = action
    let actionResult: PerformActionResult | undefined

    const useMocks =
      typeof action.useMockData === 'function'
        ? action.useMockData(this.application)
        : action.useMockData === true

    if (useMocks) {
      actionResult =
        typeof mockData === 'function' ? mockData(this.application) : mockData
    } else {
      actionResult = await this.templateAPIService.performAction({
        templateId: this.application.typeId,
        type: apiModuleAction,
        namespace,
        props: {
          application: this.application,
          auth: this.auth,
        },
      })
    }

    if (!actionResult)
      throw new Error(`No Action is defined for ${apiModuleAction}`)

    await this.updateExternalData(
      action,
      actionResult,
      apiModuleAction,
      externalDataId,
    )
  }

  buildExternalData(
    action: ApplicationTemplateAPIAction,
    actionResult: PerformActionResult,
    apiModuleAction: string,
    externalDataId?: string,
  ): ExternalData {
    if (!actionResult.success) {
      const errorReason = action.errorReasons?.find(
        (x) => x.problemType === actionResult.problemType,
      )
      return {
        [externalDataId || apiModuleAction]: {
          status: 'failure',
          date: new Date(),
          data: {},
          reason: errorReason?.reason,
          statusCode: errorReason?.statusCode ?? 500,
        },
      }
    }

    return {
      [externalDataId || apiModuleAction]: {
        status: actionResult.success ? 'success' : 'failure',
        date: new Date(),
        data: actionResult.response as ExternalData['data'],
      },
    }
  }

  async updateExternalData(
    action: ApplicationTemplateAPIAction,
    actionResult: PerformActionResult,
    apiModuleAction: string,
    externalDataId?: string,
  ): Promise<void> {
    const newExternalDataEntry = this.buildExternalData(
      action,
      actionResult,
      apiModuleAction,
      externalDataId,
    )
    this.newExternalData = { ...this.newExternalData, ...newExternalDataEntry }

    this.application.externalData = {
      ...this.application.externalData,
      ...newExternalDataEntry,
    }
  }

  async persistExternalData(
    actions: ApplicationTemplateAPIAction[],
  ): Promise<void> {
    actions.map((action) => {
      if (action.shouldPersistToExternalData === false) {
        //default should be true
        delete this.newExternalData[
          action.externalDataId || action.apiModuleAction
        ]
      }
    })

    await this.applicationService.updateExternalData(
      this.application.id,
      this.oldExternalData,
      this.newExternalData,
    )
  }
}
