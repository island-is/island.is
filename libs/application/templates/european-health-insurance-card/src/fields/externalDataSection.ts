import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { EhicCardResponseApi } from '../dataProviders'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: 'externalData.dataProvider.sectionTitle',
  children: [
    buildExternalDataProvider({
      title: 'externalData.dataProvider.pageTitle',
      id: 'approveExternalData',
      subTitle: 'externalData.dataProvider.subTitle',
      description: 'externalData.extraInformation.description',
      checkboxLabel: 'externalData.dataProvider.checkboxLabel',
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: 'externalData.nationalRegistry.title',
          subTitle: 'externalData.nationalRegistry.description',
        }),
        buildDataProviderItem({
          provider: NationalRegistrySpouseApi,
          title: 'externalData.nationalRegistry.title',
          subTitle: 'externalData.nationalRegistry.description',
        }),
        buildDataProviderItem({
          provider: ChildrenCustodyInformationApi,
          title: 'externalData.nationalRegistry.title',
          subTitle: 'externalData.nationalRegistry.description',
        }),
        buildDataProviderItem({
          provider: EhicCardResponseApi,
          title: 'EhicApi',
          subTitle: 'EhicApi',
        }),
      ],
    }),
    buildMultiField({
      id: 'getDataSuccess',
      title: 'externalData.dataProvider.getDataSuccess',
      description: 'externalData.dataProvider.getDataSuccessDescription',
      children: [
        buildDescriptionField({
          id: 'getDataSuccess.nationalRegistry',
          title: 'externalData.nationalRegistry.title',
          description: 'externalData.nationalRegistry.description',
          titleVariant: 'h4',
          space: 'gutter',
        }),
        // buildSubmitField({
        //   id: 'getDataSuccess.toDraft',
        //   title: 'externalData.dataProvider.submitButton',
        //   refetchApplicationAfterSubmit: true,
        //   placement: 'footer',
        //   actions: [
        //     {
        //       event: 'SUBMIT',
        //       name: 'externalData.dataProvider.submitButton',
        //       type: 'primary',
        //     },
        //   ],
        // }),
      ],
    }),
    // Has to be here so that the submit button appears (does not appear if no screen is left).
    // Tackle that as AS task.
    buildDescriptionField({
      id: 'unused',
      title: '',
      description: '',
    }),
  ],
})
