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
import { TemplateApiErrorProblem } from '@island.is/shared/problem'
import type { FormatMessage } from '@island.is/cms-translations'
import {
  getErrorReasonIfPresent,
  isTranslationObject,
} from '@island.is/application/core'
import type { Locale } from '@island.is/shared/types'
import { Logger, logger as islandis_logger } from '@island.is/logging'

@Injectable()
export class TemplateApiActionRunner {
  private application: ApplicationWithAttachments = {} as ApplicationWithAttachments
  private auth: User = {} as User
  private oldExternalData: ExternalData = {}
  private newExternalData: ExternalData = {}
  private formatMessage!: FormatMessage
  private currentUserLocale!: Locale

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
    currentUserLocale: Locale,
    formatMessage: FormatMessage,
  ): Promise<ApplicationWithAttachments> {
    this.application = application
    this.auth = auth

    islandis_logger.debug(
      `TemplateApi: Running actions for application id . ${application.id}`,
    )

    islandis_logger.debug(
      `TemplateApi: this.application. ${JSON.stringify(this.application)}`,
    )
    islandis_logger.debug(
      `TemplateApi: this.newExternalData ${JSON.stringify(
        this.newExternalData,
      )}`,
    )
    islandis_logger.debug(
      `TemplateApi: this.oldExternalData ${JSON.stringify(
        this.oldExternalData,
      )}`,
    )

    islandis_logger.debug(
      `TemplateApi: Setting old external data . ${JSON.stringify(
        application.externalData,
      )}`,
    )

    this.oldExternalData = application.externalData
    this.formatMessage = formatMessage
    this.currentUserLocale = currentUserLocale
    const groupedActions = this.groupByOrder(this.sortActions(actions))

    islandis_logger.debug(
      `TemplateApi: Actions to run . ${JSON.stringify(groupedActions)}`,
    )

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
        const ps = Promise.all(actions.map((action) => this.callAction(action)))
        return ps.then(() => {
          return
        })
      })
    }, Promise.resolve())

    await result
  }

  async callAction(api: TemplateApi) {
    const { actionId, action, externalDataId, params } = api
    islandis_logger.debug(
      `TemplateApi: Calling action with api : ${JSON.stringify(api)}`,
    )
    const actionResult = await this.templateAPIService.performAction({
      templateId: this.application.typeId,
      actionId,
      action,
      props: {
        application: this.application,
        auth: this.auth,
        currentUserLocale: this.currentUserLocale,
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
    if (actionResult.success) {
      return {
        [externalDataId || action]: {
          status: 'success',
          date: new Date(),
          data: actionResult.response as ExternalData['data'],
        },
      }
    }

    const error = actionResult.error

    const problem = error.problem as TemplateApiErrorProblem

    const { title, summary } = getErrorReasonIfPresent(problem.errorReason)

    const reason = {
      summary: isTranslationObject(summary)
        ? this.formatMessage(summary)
        : summary,
      title: isTranslationObject(title) ? this.formatMessage(title) : title,
    }

    return {
      [externalDataId || action]: {
        status: 'failure',
        date: new Date(),
        reason,
        statusCode: problem.status,
        data: {},
      },
    }
  }

  async updateExternalData(
    actionResult: PerformActionResult,
    action: string,
    externalDataId?: string,
  ): Promise<void> {
    islandis_logger.debug(
      `TemplateApi: updateExternalData : ${JSON.stringify({
        actionResult,
        action,
        externalDataId,
      })}`,
    )
    const newExternalDataEntry = this.buildExternalData(
      actionResult,
      action,
      externalDataId,
    )
    islandis_logger.debug(
      `TemplateApi: newExternalDataEntry : ${JSON.stringify(
        newExternalDataEntry,
      )}`,
    )
    this.newExternalData = { ...this.newExternalData, ...newExternalDataEntry }
    islandis_logger.debug(
      `TemplateApi: this.newExternalData : ${JSON.stringify(
        this.newExternalData,
      )}`,
    )
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

    islandis_logger.debug(
      `TemplateApi: Persisting data using Template apis : ${JSON.stringify(
        api,
      )}`,
    )
    islandis_logger.debug(
      `TemplateApi: Persisting old external data : ${JSON.stringify(
        this.oldExternalData,
      )}`,
    )
    islandis_logger.debug(
      `TemplateApi: Persisting new external data : ${JSON.stringify(
        this.newExternalData,
      )}`,
    )

    await this.applicationService.updateExternalData(
      this.application.id,
      this.oldExternalData,
      this.newExternalData,
    )
  }
}
