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

@Injectable()
export class TemplateApiActionRunner {
  private formatMessage!: FormatMessage
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
    const oldExternalData = application.externalData

    const newExternalData = { data: {} }
    this.formatMessage = formatMessage

    const groupedActions = this.groupByOrder(this.sortActions(actions))

    await this.runActions(
      groupedActions,
      application,
      newExternalData,
      auth,
      currentUserLocale,
      formatMessage,
    )

    await this.persistExternalData(
      actions,
      application.id,
      oldExternalData,
      newExternalData,
    )
    return application
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
        return groupedActions[value as unknown as number]
      },
    )

    return result
  }

  async runActions(
    actionGroups: TemplateApi[][],
    application: ApplicationWithAttachments,
    newExternalData: { data: ExternalData },
    auth: User,
    currentUserLocale: Locale,
    formatMessage: FormatMessage,
  ) {
    const result = actionGroups.reduce((accumulatorPromise, actions) => {
      return accumulatorPromise.then(() => {
        const ps = Promise.all(
          actions.map((action) =>
            this.callAction(
              action,
              application,
              newExternalData,
              auth,
              currentUserLocale,
              formatMessage,
            ),
          ),
        )
        return ps.then(() => {
          return
        })
      })
    }, Promise.resolve())

    await result
  }

  async callAction(
    api: TemplateApi,
    application: ApplicationWithAttachments,
    newExternalData: { data: ExternalData },
    auth: User,
    currentUserLocale: Locale,
    formatMessage: FormatMessage,
  ) {
    const { actionId, action, externalDataId, params } = api

    const actionResult = await this.templateAPIService.performAction({
      templateId: application.typeId,
      actionId,
      action,
      props: {
        application: application,
        auth: auth,
        currentUserLocale: currentUserLocale,
        params,
      },
    })

    if (!actionResult) throw new Error(`No Action is defined for ${actionId}`)

    await this.updateExternalData(
      actionResult,
      action,
      application,
      newExternalData,
      formatMessage,
      externalDataId,
    )
  }

  buildExternalData(
    actionResult: PerformActionResult,
    action: string,
    formatMessage: FormatMessage,
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
        reason: Array.isArray(problem.errorReason)
          ? problem.errorReason
          : reason,
        statusCode: problem.status,
        data: {},
      },
    }
  }

  async updateExternalData(
    actionResult: PerformActionResult,
    action: string,
    application: ApplicationWithAttachments,
    newExternalData: { data: ExternalData },
    formatMessage: FormatMessage,
    externalDataId?: string,
  ): Promise<void> {
    const newExternalDataEntry = this.buildExternalData(
      actionResult,
      action,
      formatMessage,
      externalDataId,
    )
    Object.assign(newExternalData.data, newExternalDataEntry)
    application.externalData = {
      ...application.externalData,
      ...newExternalDataEntry,
    }
  }

  async persistExternalData(
    api: TemplateApi[],
    applicationId: string,
    oldExternalData: ExternalData,
    newExternalData: { data: ExternalData },
  ): Promise<void> {
    api.map((api) => {
      if (api.shouldPersistToExternalData === false) {
        delete newExternalData.data[api.externalDataId || api.action]
      }
    })

    await this.applicationService.updateExternalData(
      applicationId,
      oldExternalData,
      newExternalData.data,
    )
  }
}
