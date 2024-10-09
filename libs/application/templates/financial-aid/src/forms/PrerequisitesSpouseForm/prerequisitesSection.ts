import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { CurrentApplicationApi, TaxDataSpouseApi } from '../../dataProviders'

export const prerequisitesSection = buildSection({
  id: 'externalDataSpouse',
  title: m.section.dataGathering,
  children: [
    buildExternalDataProvider({
      title: m.externalData.general.pageTitle,
      id: 'approveExternalDataSpouse',
      subTitle: m.externalData.general.subTitle,
      description: m.externalData.general.description,
      checkboxLabel: m.externalData.general.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: TaxDataSpouseApi,
          title: m.externalData.taxData.title,
          subTitle: m.externalData.taxData.dataInfo,
        }),
        buildDataProviderItem({
          provider: CurrentApplicationApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'moreTaxInfo',
          type: undefined,
          title: '',
          subTitle: m.externalData.taxData.process,
        }),
      ],
    }),
  ],
})
