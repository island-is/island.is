import { buildDataProviderItem } from '@island.is/application/core'
import { m } from '../../lib/messages'

export const dataCollection = [
  buildDataProviderItem({
    id: 'nationalRegistry',
    type: 'NationalRegistryProvider',
    title: m.dataCollectionNationalRegistryTitle,
    subTitle: m.dataCollectionNationalRegistrySubtitle,
  }),
  buildDataProviderItem({
    id: 'userProfile',
    type: 'UserProfileProvider',
    title: m.dataCollectionUserProfileTitle,
    subTitle: m.dataCollectionUserProfileSubtitle,
  }),
  buildDataProviderItem({
    id: 'birthCertificate',
    type: '',
    title: m.dataCollectionBirthCertificateTitle,
    subTitle: m.dataCollectionBirthCertificateDescription,
  }),
  buildDataProviderItem({
    id: 'maritalStatus',
    type: 'NationalRegistryMaritalStatusProvider',
    title: m.dataCollectionMaritalStatusTitle,
    subTitle: m.dataCollectionMaritalStatusDescription,
  }),
  buildDataProviderItem({
    id: 'districtCommissioners',
    type: 'DistrictsProvider',
    title: '',
    subTitle: '',
  }),
  buildDataProviderItem({
    id: 'religions',
    type: 'ReligionsProvider',
    title: '',
    subTitle: '',
  }),
]
