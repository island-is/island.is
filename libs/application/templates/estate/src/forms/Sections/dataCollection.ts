import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
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
          subTitle: (application) =>
            application.answers.selectedEstate ===
            EstateTypes.estateWithoutAssets
              ? /* EIGNALAUST DÁNARBU */
                m.providerSubtitleEstateWithoutAssets
              : application.answers.selectedEstate ===
                EstateTypes.officialDivision
              ? /* OPINBER SKIPTI */
                m.providerSubtitleOfficialDivision
              : application.answers.selectedEstate ===
                EstateTypes.permitForUndividedEstate
              ? /* SETA Í ÓSKIPTU BÚI */
                m.providerSubtitleUndividedEstate
              : /* EINKASKIPTI */
                m.providerSubtitleDivisionOfEstateByHeirs,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.personalInfoProviderTitle,
          subTitle: (application) =>
            application.answers.selectedEstate ===
            EstateTypes.estateWithoutAssets
              ? /* EIGNALAUST DÁNARBU */
                m.personalInfoProviderSubtitleEstateWithoutAssets
              : application.answers.selectedEstate ===
                EstateTypes.officialDivision
              ? /* OPINBER SKIPTI */
                m.personalInfoProviderSubtitleOfficialDivision
              : application.answers.selectedEstate ===
                EstateTypes.permitForUndividedEstate
              ? /* SETA Í ÓSKIPTU BÚI */
                m.personalInfoProviderSubtitleUndividedEstate
              : /* EINKASKIPTI */
                m.personalInfoProviderSubtitleDivisionOfEstateByHeirs,
        }),
        // subTitle: m.settingsInfoProviderSubtitle,
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.settingsInfoProviderTitle,
          subTitle: (application) =>
          application.answers.selectedEstate ===
          EstateTypes.estateWithoutAssets
            ? /* EIGNALAUST DÁNARBU */
              m.settingsInfoProviderSubtitleEstateWithoutAssets
            : application.answers.selectedEstate ===
              EstateTypes.officialDivision
            ? /* OPINBER SKIPTI */
              m.settingsInfoProviderSubtitleOfficialDivision
            : application.answers.selectedEstate ===
              EstateTypes.permitForUndividedEstate
            ? /* SETA Í ÓSKIPTU BÚI */
              m.settingsInfoProviderSubtitleUndividedEstate
            : /* EINKASKIPTI */
              m.settingsInfoProviderSubtitleDivisionOfEstateByHeirs,
        }),
      ],
    }),
  ],
})
