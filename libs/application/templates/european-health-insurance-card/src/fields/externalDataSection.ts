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

    // buildMultiField({
    //   id: 'intro',
    //   title: e.introScreen.sectionLabel,
    //   children: [
    //     buildCustomField(
    //       {
    //         id: 'introScreen',
    //         title: e.introScreen.sectionTitle,
    //         component: 'IntroScreen',
    //       },
    //       {
    //         subTitle: e.introScreen.sectionDescription,
    //       },
    //     ),
    //     // buildSubmitField({
    //     //   id: 'getDataSuccess.toDraft',
    //     //   title: 'externalData.dataProvider.submitButton',
    //     //   refetchApplicationAfterSubmit: true,
    //     //   placement: 'footer',
    //     //   actions: [
    //     //     {
    //     //       event: 'SUBMIT',
    //     //       name: 'externalData.dataProvider.submitButton',
    //     //       type: 'primary',
    //     //     },
    //     //   ],
    //     // }),
    //   ],
    // }),
    // Has to be here so that the submit button appears (does not appear if no screen is left).
    // Tackle that as AS task.
  ],
})
