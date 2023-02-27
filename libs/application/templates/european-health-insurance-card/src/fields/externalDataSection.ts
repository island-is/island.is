import {
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { EhicCardResponseApi } from '../dataProviders'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const externalDataSection = buildSection({
  id: 'intro',
  title:  e.introScreen.sectionLabel,
  children: [
    buildExternalDataProvider({
      title:  e.introScreen.sectionTitle,
      id: 'introScreen',
      description: e.introScreen.sectionDescription,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: NationalRegistrySpouseApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: ChildrenCustodyInformationApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: EhicCardResponseApi,
          title: '',
          subTitle: '',
        }),
      ],
    }),
  ],
})
