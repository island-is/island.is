import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { EstateApi } from '../../dataProviders'
import { m } from '../../lib/messages'
import { EstateTypes } from '../../lib/constants'

export const dataCollection = buildSection({
  id: 'externalData',
  title: m.dataCollectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.dataCollectionTitle,
      subTitle: m.dataCollectionSubtitle,
      checkboxLabel: m.dataCollectionCheckbox,
      dataProviders: [
        buildDataProviderItem({
          provider: EstateApi,
          title: m.deceasedInfoProviderTitle,
          subTitle: ({ answers }) =>
            answers.selectedEstate === EstateTypes.estateWithoutAssets
              ? /* EIGNALAUST DÁNARBU */
                m.providerSubtitleEstateWithoutAssets
              : answers.selectedEstate === EstateTypes.officialDivision
              ? /* OPINBER SKIPTI */
                m.providerSubtitleOfficialDivision
              : answers.selectedEstate === EstateTypes.permitForUndividedEstate
              ? /* SETA Í ÓSKIPTU BÚI */
                m.providerSubtitleUndividedEstate
              : /* EINKASKIPTI */
                m.providerSubtitleDivisionOfEstateByHeirs,
        }),
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title: m.personalInfoProviderTitle,
          subTitle: ({ answers }) =>
            answers.selectedEstate === EstateTypes.estateWithoutAssets
              ? /* EIGNALAUST DÁNARBU */
                m.personalInfoProviderSubtitleEstateWithoutAssets
              : answers.selectedEstate === EstateTypes.officialDivision
              ? /* OPINBER SKIPTI */
                m.personalInfoProviderSubtitleOfficialDivision
              : answers.selectedEstate === EstateTypes.permitForUndividedEstate
              ? /* SETA Í ÓSKIPTU BÚI */
                m.personalInfoProviderSubtitleUndividedEstate
              : /* EINKASKIPTI */
                m.personalInfoProviderSubtitleDivisionOfEstateByHeirs,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.settingsInfoProviderTitle,
          subTitle: ({ answers }) =>
            answers.selectedEstate === EstateTypes.estateWithoutAssets
              ? /* EIGNALAUST DÁNARBU */
                m.settingsInfoProviderSubtitleEstateWithoutAssets
              : answers.selectedEstate === EstateTypes.officialDivision
              ? /* OPINBER SKIPTI */
                m.settingsInfoProviderSubtitleOfficialDivision
              : answers.selectedEstate === EstateTypes.permitForUndividedEstate
              ? /* SETA Í ÓSKIPTU BÚI */
                m.settingsInfoProviderSubtitleUndividedEstate
              : /* EINKASKIPTI */
                m.settingsInfoProviderSubtitleDivisionOfEstateByHeirs,
        }),
      ],
    }),
  ],
})
