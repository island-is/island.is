import {
  ChildrenCustodyInformationApi,
  FormModes,
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
  buildSubmitField,
} from '@island.is/application/core'

import { EhicCardResponseApi } from '../dataProviders'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const externalDataSection = buildSection({
  id: 'data',
  title: e.data.sectionLabel,
  children: [
    buildExternalDataProvider({
      title: e.data.sectionTitle,
      checkboxLabel: e.data.dataCollectionCheckboxLabel,
      id: 'approveExternalData',
      description: '',
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: 'Þjóðskrá Íslands',
          subTitle:
            'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
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
          title: 'Sjúkratryggingar',
          subTitle:
            'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
        }),
      ],
    }),

    buildMultiField({
      id: 'getDataSuccess',
      title: 'datasuccess title',
      description: 'dataSuccess description',
      children: [
        buildDescriptionField({
          id: 'getDataSuccess.nationalRegistry',
          title: 'Þjóðskrá title',
          description: 'Þjóðskrá description',
          titleVariant: 'h4',
        }),
        buildSubmitField({
          id: 'getDataSuccess.toDraft',
          title: 'sumbmit title',
          refetchApplicationAfterSubmit: true,
          placement: 'footer',
          actions: [
            {
              event: 'SUBMIT',
              name: 'submit text',
              type: 'primary',
            },
          ],
        }),
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
