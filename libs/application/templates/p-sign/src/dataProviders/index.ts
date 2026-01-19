import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
  DistrictsApi,
  QualityPhotoApi,
} from '@island.is/application/types'

export const DoctorsNoteApi = defineTemplateApi({
  action: 'doctorsNote',
})
