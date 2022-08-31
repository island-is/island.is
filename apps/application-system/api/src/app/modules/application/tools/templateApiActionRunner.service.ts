import { ApplicationService } from '@island.is/application/api/core'
import {
  TemplateApi,
  ApplicationWithAttachments,
  ExternalData,
  PerformActionResult,
} from '@island.is/application/types'
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
   * Actions with no order are run first in parallel.
   * Application is then updated with new external data from each action with persistToExternalData set to true
   * @param application
   * @param actions
   * @param auth
   * @returns Updated application
   */
  async run(
    application: ApplicationWithAttachments,
    actions: TemplateApi[],
    auth: User,
  ): Promise<ApplicationWithAttachments> {
    this.application = application
    this.auth = auth
    this.oldExternalData = application.externalData

    const groupedActions = this.groupByOrder(this.sortActions(actions))
    await this.runActions(groupedActions)

    await this.persistExternalData(actions)

    return this.application
  }

  sortActions(actions: TemplateApi[]) {
    const sortedActions = actions.sort((a, b) => {
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

  groupByOrder(actions: TemplateApi[]): TemplateApi[][] {
    const groupedActions = actions.reduce((acc, action) => {
      const order = action.order ?? 0
      if (!acc[order]) {
        acc[order] = []
      }
      acc[order].push(action)
      return acc
    }, {} as { [key: number]: TemplateApi[] })

    const result = Object.keys(groupedActions).map(
      (value: string): TemplateApi[] => {
        return groupedActions[(value as unknown) as number]
      },
    )

    return result
  }

  async runActions(actionGroups: TemplateApi[][]) {
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

  async callProvider(api: TemplateApi) {
    const { actionId, action, externalDataId, params } = api

    const actionResult = await this.templateAPIService.performAction({
      templateId: this.application.typeId,
      actionId,
      props: {
        application: this.application,
        auth: this.auth,
        params,
      },
    })

    if (!actionResult) throw new Error(`No Action is defined for ${actionId}`)

    await this.updateExternalData(actionResult, action, externalDataId)
  }

  buildExternalData(
    actionResult: PerformActionResult,
    action: string,
    externalDataId?: string,
  ): ExternalData {
    return {
      [externalDataId || action]: {
        status: actionResult.success ? 'success' : 'failure',
        date: new Date(),
        data: (actionResult.success
          ? actionResult.response
          : actionResult.error) as ExternalData['data'],
      },
    }
  }

  async updateExternalData(
    actionResult: PerformActionResult,
    action: string,
    externalDataId?: string,
  ): Promise<void> {
    const newExternalDataEntry = this.buildExternalData(
      actionResult,
      action,
      externalDataId,
    )
    this.newExternalData = { ...this.newExternalData, ...newExternalDataEntry }

    this.application.externalData = {
      ...this.application.externalData,
      ...newExternalDataEntry,
    }
  }

  async persistExternalData(api: TemplateApi[]): Promise<void> {
    api.map((api) => {
      if (api.shouldPersistToExternalData === false) {
        //default should be true
        delete this.newExternalData[api.externalDataId || api.action]
      }
    })

    await this.applicationService.updateExternalData(
      this.application.id,
      this.oldExternalData,
      this.newExternalData,
    )
  }
}
