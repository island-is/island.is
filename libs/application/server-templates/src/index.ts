import {
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { criminalRecord } from './lib/criminal-record'
import { caramelPermission } from './lib/caramel'

export const TemplateMapper: Partial<
  Record<ApplicationTypes, ApplicationTemplate<any, any, any>>
> = {
  [ApplicationTypes.NEW_TYPE_OF_APPLICATION]: criminalRecord,
  [ApplicationTypes.CARAMEL]: caramelPermission,
}
