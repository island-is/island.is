import {
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCardReview: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'applicants',
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
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: e.review.sectionReviewTitle,
          description: e.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Sækja um pdf',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

export default EuropeanHealthInsuranceCardReview
