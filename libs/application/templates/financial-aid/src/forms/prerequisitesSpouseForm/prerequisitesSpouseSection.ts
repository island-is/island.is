import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { CurrentApplicationApi, TaxDataSpouseApi } from '../../dataProviders'
import * as m from '../../lib/messages'

export const prerequisitesSpouseSection = buildSection({
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
          subTitle: '',
        }),
        buildDataProviderItem({
          id: 'moreTaxInfo',
          type: undefined,
          subTitle: m.externalData.taxData.process,
        }),
      ],
    }),
  ],
})
