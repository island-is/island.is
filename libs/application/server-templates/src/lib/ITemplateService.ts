import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { AnyEventObject, EventObject } from 'xstate'

export abstract class BaseTemplateService<
  T extends EventObject = AnyEventObject,
> {
  constructor(
    protected template: ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<T>,
      T
    >,
    protected templateId: ApplicationTypes,
  ) {}

  public getTemplateId(): ApplicationTypes {
    return this.templateId
  }

  public getTemplate(): ApplicationTemplate<
    ApplicationContext,
    ApplicationStateSchema<T>,
    T
  > {
    return this.template
  }
}
