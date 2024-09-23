import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../lib/constants'

export {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'

export const CurrentApplicationApi = defineTemplateApi({
  action: ApiActions.CURRENTAPPLICATION,
})

export const CreateApplicationApi = defineTemplateApi({
  action: ApiActions.CREATEAPPLICATION,
  externalDataId: 'currentApplication',
})
