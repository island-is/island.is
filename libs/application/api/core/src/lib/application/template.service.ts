import { EventObject } from 'xstate'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes, StaticText } from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import {
  ApplicationContext,
  ApplicationTemplate,
  ApplicationStateMeta,
  ApplicationStateSchema,
} from '@island.is/application/types'

@Injectable()
export class TemplateService<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> {
  async getApplicationStateInformation(
    stateKey: string,
    applicationType: ApplicationTypes,
  ): Promise<ApplicationStateMeta<TEvents> | undefined> {
    const template: ApplicationTemplate<
      TContext,
      TStateSchema,
      TEvents
    > = await getApplicationTemplateByTypeId(applicationType)
    return template.stateMachineConfig.states[stateKey]?.meta
  }

  async getHistoryLog(
    transition: 'exit' | 'entry',
    stateKey: string,
    applicationType: ApplicationTypes,
  ): Promise<StaticText | undefined> {
    const stateInfo = await this.getApplicationStateInformation(
      stateKey,
      applicationType,
    )

    return transition === 'entry'
      ? stateInfo?.actionCard?.onEntryHistoryLog
      : stateInfo?.actionCard?.onExitHistoryLog
  }

  async getApplicationTranslationNamespaces(
    applicationType: ApplicationTypes,
  ): Promise<string[]> {
    const template = await getApplicationTemplateByTypeId(applicationType)

    // We load the core namespace for the application system + the ones defined in the application template
    return ['application.system', ...(template?.translationNamespaces ?? [])]
  }
}
