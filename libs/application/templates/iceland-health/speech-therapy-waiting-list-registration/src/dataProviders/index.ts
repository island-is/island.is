import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiModuleActions } from '../utils/constants'
export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const ChildrenApi = defineTemplateApi({
  action: ApiModuleActions.getChildren,
  externalDataId: 'children',
  namespace: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
})

export const LanguagesApi = defineTemplateApi({
  action: ApiModuleActions.getLanguages,
  externalDataId: 'languages',
  namespace: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
})

export const AvailableLocationsApi = defineTemplateApi({
  action: ApiModuleActions.getAvailableLocations,
  externalDataId: 'availableLocations',
  namespace: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
})

export const SpeechPathologistsApi = defineTemplateApi({
  action: ApiModuleActions.getSpeechPathologists,
  externalDataId: 'speechPathologists',
  namespace: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
})

export const RejectionReasonsApi = defineTemplateApi({
  action: ApiModuleActions.getRejectionReasons,
  externalDataId: 'rejectionReasons',
  namespace: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
})
