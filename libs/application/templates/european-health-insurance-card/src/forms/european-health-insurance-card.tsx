import {
  Comparators,
  defineTemplateApi,
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  buildCompanySearchField,
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import styles from './european-health-insurance-card.module.scss'
import { externalDataSection } from '../fields/externalDataSection'
import { ApiActions } from '../dataProviders/actions.enum'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCard: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    externalDataSection,

    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,

      children: [
        buildCustomField(
          {
            id: 'introScreen',
            title: e.introScreen.sectionTitle,
            component: 'IntroScreen',
          },
          {
            subTitle: e.introScreen.sectionDescription,
          },
        ),
      ],
    }),

    buildSection({
      id: 'applicants',
      title: e.applicants.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicants',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          children: [
            buildCustomField({
              id: 'applicants',
              title: '',
              component: 'Applicants',
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [
        buildMultiField({
          id: 'temp',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            buildCustomField({
              id: 'temp',
              title: '',
              component: 'TempScreen',
            }),
          ],
        }),
      ],
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
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'applicant',
      title: 'Staðfesting',
      children: [
        buildTextField({
          id: 'applicant.email',
          title: 'temp label',
          variant: 'email',
          backgroundColor: 'blue',
          required: true,
          defaultValue: '',
        }),
      ],
    }),
  ],
})

export default EuropeanHealthInsuranceCard
