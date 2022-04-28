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

    const groupedActions = this.groupByOrder(actions)
    this.runActions(groupedActions)

    this.persistExternalData(actions)

    return this.application
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

  groupByOrder(
    actions: ApplicationTemplateAPIAction[],
  ): ApplicationTemplateAPIAction[][] {
    const groupedActions = actions.reduce((acc, action) => {
      const order = action.order ?? -1
      if (!acc[order]) {
        acc[order] = []
      }
      acc[order].push(action)
      return acc
    }, {} as { [key: number]: ApplicationTemplateAPIAction[] })

    return Object.keys(groupedActions).map(
      (value: string): ApplicationTemplateAPIAction[] => {
        return groupedActions[(value as unknown) as number]
      },
    )
  }

  async callProvider(action: ApplicationTemplateAPIAction) {
    console.log(
      `makeCall to ${action.apiModuleAction} for application ${this.application.id}`,
    )

    const {
      apiModuleAction,
      shouldPersistToExternalData,
      externalDataId,
      useMockData,
      mockData,
    } = action

    let actionResult: PerformActionResult | undefined

    if (useMockData) {
      console.log('USING MOOOOKXS')
      console.log({ mockData })
      actionResult =
        typeof mockData === 'function' ? mockData(this.application) : mockData
    } else {
      actionResult = await this.templateAPIService.performAction({
        templateId: this.application.typeId,
        type: apiModuleAction,
        props: {
          application: this.application,
          auth: this.auth,
        },
      })
    }
    console.log({ actionResult })
    if (!actionResult)
      throw new Error(`No Action or mock is defined for ${apiModuleAction}`)

    await this.updateExternalData(
      actionResult,
      apiModuleAction,
      externalDataId,
      shouldPersistToExternalData ?? false,
    )
    console.log(
      `done!!!!! makeCall to ${action.apiModuleAction} for application ${this.application.id}`,
    )
  }

  async persistExternalData(
    actions: ApplicationTemplateAPIAction[],
  ): Promise<void> {
    /*   actions.map((action) => {
      if (!action.shouldPersistToExternalData) {
        delete this.application.externalData[
          action.externalDataId || action.apiModuleAction
        ]
      }
    })*/

    const {
      updatedApplication: withExternalData,
    } = await this.applicationService.updateExternalData(
      this.application.id,
      this.oldExternalData,
      this.newExternalData,
    )
    this.application = withExternalData as ApplicationWithAttachments
  }

  async updateExternalData(
    actionResult: PerformActionResult,
    apiModuleAction: string,
    externalDataId?: string,
    persist?: boolean,
  ): Promise<void> {
    const newExternalDataEntry: ExternalData = {
      [externalDataId || apiModuleAction]: {
        status: actionResult.success ? 'success' : 'failure',
        date: new Date(),
        data: actionResult.success
          ? (actionResult.response as ExternalData['data'])
          : actionResult.error,
      },
    }

    this.newExternalData = { ...this.newExternalData, ...newExternalDataEntry }

    this.application.externalData = {
      ...this.application.externalData,
      ...this.newExternalData,
    }
    console.log(this.application.externalData)
  }
}
