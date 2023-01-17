import {
  defineTemplateApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

export const EhicNationalRegistryUserApi = NationalRegistryUserApi.configure({
  externalDataId: 'NationalRegistryUserApi',
  order: 0,
})

export const EhicNationalRegistrySpouseApi = NationalRegistryUserApi.configure({
  externalDataId: 'NationalRegistrySpouseApi',
  order: 1,
})

export const EhicChildrenCustodyInformationApi = NationalRegistryUserApi.configure(
  {
    externalDataId: 'ChildrenCustodyInformationApi',
    order: 2,
  },
)

// export const EhicService = defineTemplateApi({
//   order: 3,
//   action: 'getCardResponse',
//   externalDataId: 'ehicCardProvider',
// })
