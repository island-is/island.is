import { Comparators, Form, FormModes } from '@island.is/application/types'
import {
  buildCompanySearchField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import styles from './european-health-insurance-card.module.scss'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps { }

export const EuropeanHealthInsuranceCard: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [
        buildCustomField(
          {
            id: 'introScreen',
            title: e.introScreen.sectionTitle,
            component: 'IntroScreen',
          }, {
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
          id: 'constraints',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          children: [
            buildCustomField({
              id: 'constraints',
              title: '',
              component: 'Constraints',
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
          id: 'constraints2',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            buildCustomField({
              id: 'constraints2',
              title: '',
              component: 'Constraints',
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
