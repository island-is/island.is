import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../lib/constants'

export {
  NationalRegistryV3UserApi,
  NationalRegistryV3SpouseApi,
  ChildrenCustodyInformationApiV3,
} from '@island.is/application/types'

export const CurrentApplicationApi = defineTemplateApi({
  action: ApiActions.CURRENTAPPLICATION,
})

export const CreateApplicationApi = defineTemplateApi({
  action: ApiActions.CREATEAPPLICATION,
  externalDataId: 'currentApplication',
})

export const MunicipalityApi = defineTemplateApi({
  action: ApiActions.MUNICIPALITY,
  order: 1, // Make this action run after the national registry actions to have access to the municipality code
})

export const TaxDataApi = defineTemplateApi({
  action: ApiActions.TAXDATA,
})

export const TaxDataSpouseApi = defineTemplateApi({
  action: ApiActions.TAXDATA,
  externalDataId: 'taxDataSpouse',
})

export const SendSpouseEmailApi = defineTemplateApi({
  action: ApiActions.SENDSPOUSEEMAIL,
})
