import {
  defineTemplateApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'

export const EhicNationalRegistry = NationalRegistryUserApi.configure({
  externalDataId: 'ehicNationalRegistry',
  order: 0,
})

export const EhicService = defineTemplateApi({
  order: 1,
  action: 'getCardResponse',
  externalDataId: 'ehicCardProvider',
})
