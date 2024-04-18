import { Injectable } from '@nestjs/common'
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
import { template } from './template'

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

interface TemplateService<T extends EventObject = AnyEventObject> {
  getTemplate(): ApplicationTemplate<
    ApplicationContext,
    ApplicationStateSchema<T>,
    T
  >
}

@Injectable()
export class ExampleTemplateService implements TemplateService<Events> {
  getTemplate(): ApplicationTemplate<
    ApplicationContext,
    ApplicationStateSchema<Events>,
    Events
  > {
    return template
  }
}
