import { ApplicationService } from '@island.is/application/api/core'
import { HistoryService } from '@island.is/application/api/history'
import { IntlService } from '@island.is/cms-translations'
import { Injectable } from '@nestjs/common'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
import type { Unwrap, Locale } from '@island.is/shared/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { User } from '@island.is/auth-nest-tools'
import { Inject } from '@nestjs/common'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationWithAttachments as BaseApplication,
  TemplateApi,
} from '@island.is/application/types'

import { getApplicationLifecycle } from './utils/application'
import { StateChangeResult, TemplateAPIModuleActionResult } from './types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ApplicationActionService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private intlService: IntlService,
    private templateApiActionRunner: TemplateApiActionRunner,
    private applicationService: ApplicationService,
    private historyService: HistoryService,
  ) {}

  async performActionOnApplication(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    auth: User,
    apis: TemplateApi | TemplateApi[],
    locale: Locale,
    event: string,
  ): Promise<TemplateAPIModuleActionResult> {
    if (!Array.isArray(apis)) {
      apis = [apis]
    }

    //Filter out events that should be triggered through triggerEvent or are not defined
    //if triggerEvent is not defined then it should be triggered
    apis = apis.filter(
      (api) => api.triggerEvent === undefined || api.triggerEvent === event,
    )

    //return early if no apis are left
    if (apis.length === 0) {
      return {
        updatedApplication: application,
        hasError: false,
      }
    }

    this.logger.info(
      `Performing actions ${apis
        .map((api) => api.action)
        .join(', ')} on ${JSON.stringify(template.name)}`,
    )
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)
    const updatedApplication = await this.templateApiActionRunner.run(
      application,
      apis,
      auth,
      locale,
      intl.formatMessage,
    )

    for (const api of apis) {
      const result =
        updatedApplication.externalData[api.externalDataId || api.action]

      this.logger.debug(
        `Performing action ${api.action} on ${JSON.stringify(
          template.name,
        )} ended with ${result.status}`,
      )

      if (result.status === 'failure' && api.throwOnError) {
        return {
          updatedApplication,
          hasError: true,
          error: result.reason,
        }
      }
    }

    this.logger.debug(
      `Updated external data for application with ID ${updatedApplication.id}`,
    )

    return {
      updatedApplication,
      hasError: false,
    }
  }

  async changeState(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    event: string,
    auth: User,
    locale: Locale,
  ): Promise<StateChangeResult> {
    const helper = new ApplicationTemplateHelper(application, template)
    const onExitStateAction = helper.getOnExitStateAPIAction(application.state)
    let updatedApplication: BaseApplication = application
    await this.applicationService.clearNonces(updatedApplication.id)
    if (onExitStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onExitStateAction,
        locale,
        event,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasChanged: false,
          application: updatedApplication,
          error,
          hasError: true,
        }
      }
    }

    const [hasChanged, newState, withUpdatedState] =
      new ApplicationTemplateHelper(updatedApplication, template).changeState(
        event,
      )
    updatedApplication = {
      ...updatedApplication,
      answers: withUpdatedState.answers,
      assignees: withUpdatedState.assignees,
      state: withUpdatedState.state,
    }

    if (!hasChanged) {
      return {
        hasChanged: false,
        hasError: false,
        application: updatedApplication,
      }
    }

    const onEnterStateAction = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getOnEntryStateAPIAction(newState)

    if (onEnterStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onEnterStateAction,
        locale,
        event,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasError: true,
          hasChanged: false,
          error: error,
          application,
        }
      }
    }

    const status = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getApplicationStatus()

    try {
      const update = await this.applicationService.updateApplicationState(
        application.id,
        newState,
        updatedApplication.answers,
        updatedApplication.assignees,
        status,
        getApplicationLifecycle(updatedApplication, template),
      )

      updatedApplication = update.updatedApplication as BaseApplication
      await this.historyService.saveStateTransition(
        application.id,
        newState,
        auth,
        event,
      )
    } catch (e) {
      this.logger.error(e)
      return {
        hasChanged: false,
        hasError: true,
        application,
        error: 'Could not update application',
      }
    }

    return {
      hasChanged: true,
      application: updatedApplication,
      hasError: false,
    }
  }
}
