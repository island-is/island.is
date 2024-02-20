import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { criminalRecord } from './lib/criminal-record'
import { caramelPermission } from './lib/caramel'
import { noDebtCertificate } from './lib/nodebt-certificate'
import { newTypeOfApplication } from './lib/example'
import { EventObject } from 'xstate'

export const TemplateMapper: Partial<
  Record<ApplicationTypes, ApplicationTemplate<any, any, any>>
> = {
  [ApplicationTypes.CRIMINAL_RECORD]: criminalRecord,
  [ApplicationTypes.CARAMEL]: caramelPermission,
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: noDebtCertificate,
  [ApplicationTypes.NEW_TYPE_OF_APPLICATION]: newTypeOfApplication,
}

//write an empty functions that takes in a string and returns type Partial<Record<ApplicationTypes, ApplicationTemplate<any, any, any>>>

export function getApplicationBySubTypeId<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject,
>(subTypeId: string): ApplicationTemplate<TContext, TStateSchema, TEvents> {
  let template
  switch (subTypeId) {
    case 'NEW_TYPE_OF_APPLICATION':
      template = newTypeOfApplication
      break
    case 'sakavottord':
      template = criminalRecord
      break
    case 'CRIMINAL_RECORD':
      template = criminalRecord
      break
    case 'CARAMEL':
      template = caramelPermission
      break
    case 'NO_DEBT_CERTIFICATE':
      template = noDebtCertificate
      break
    default:
      throw new Error('Template not found')
  }

  return template as unknown as ApplicationTemplate<
    TContext,
    TStateSchema,
    TEvents
  >
}
