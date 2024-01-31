import {
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { criminalRecord } from './lib/criminal-record'
import { caramelPermission } from './lib/caramel'
import { noDebtCertificate } from './lib/nodebt-certificate'
import { newTypeOfApplication } from './lib/example'

export const TemplateMapper: Partial<
  Record<ApplicationTypes, ApplicationTemplate<any, any, any>>
> = {
  [ApplicationTypes.CRIMINAL_RECORD]: criminalRecord,
  [ApplicationTypes.CARAMEL]: caramelPermission,
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: noDebtCertificate,
  [ApplicationTypes.NEW_TYPE_OF_APPLICATION]: newTypeOfApplication,
}
