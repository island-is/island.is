import {
  ChildrenCustodyInformationApiV3,
  NationalRegistryV3SpouseApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'

import { EhicCardResponseApi } from '../dataProviders'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceCardPre: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardPre',
  logo: IcelandHealthLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,

      children: [
        buildDescriptionField({
          id: 'introScreen',
          title: e.introScreen.sectionTitle,
          description: e.introScreen.sectionDescription,
        }),
      ],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [
        buildExternalDataProvider({
          title: e.data.sectionTitle,
          checkboxLabel: e.data.dataCollectionCheckboxLabel,
          id: 'approveExternalData',
          description: '',
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: e.data.dataCollectionButtonLabel,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: e.data.dataCollectionButtonLabel,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: e.data.dataCollectionNationalRegistryTitle,
              subTitle: e.data.dataCollectionNationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: NationalRegistryV3SpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApiV3,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: EhicCardResponseApi,
              title: e.data.dataCollectionHealthInsuranceTitle,
              subTitle: e.data.dataCollectionHealthInsuranceDescription,
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'plastic',
      title: e.applicants.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [],
    }),
    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardPre
