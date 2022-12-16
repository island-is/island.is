import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  DistrictsApi,
  QualityPhotoApi,
} from '@island.is/application/types'

export const DoctorsNoteApi = defineTemplateApi({
  action: 'doctorsNote',
})
