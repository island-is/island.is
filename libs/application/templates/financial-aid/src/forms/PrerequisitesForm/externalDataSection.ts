import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  ChildrenCustodyInformationApi,
  CurrentApplicationApi,
  MunicipalityApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  TaxDataApi,
} from '../../dataProviders'

export const externalDataSection = buildSection({
  id: 'externalData',
  title: m.section.dataGathering,
  children: [
    buildExternalDataProvider({
      title: m.externalData.general.pageTitle,
      id: 'approveExternalData',
      subTitle: m.externalData.general.subTitle,
      description: m.externalData.general.description,
      checkboxLabel: m.externalData.general.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.externalData.applicant.title,
          subTitle: m.externalData.applicant.subTitle,
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
          provider: MunicipalityApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: CurrentApplicationApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: TaxDataApi,
          title: m.externalData.taxData.title,
          subTitle: m.externalData.taxData.dataInfo,
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
