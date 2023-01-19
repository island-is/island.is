import {
  Comparators,
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
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
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import styles from './european-health-insurance-card.module.scss'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}
export const EuropeanHealthInsuranceCard: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    // buildSection({
    //   id: 'externalData',
    //   title: e.introScreen.sectionLabel,
    //   children: [
    //     buildExternalDataProvider({
    //       id: 'approveExternalData',
    //       title: 'TODO: Gögn frá þjóðskrá',
    //       subTitle: 'TODO: Samþykkja gögn',
    //       checkboxLabel: 'TODO: Ég samþykki',
    //       dataProviders: [
    //         buildDataProviderItem({
    //           provider: NationalRegistryUserApi,
    //           title: 'externalData.nationalRegistry.title',
    //           subTitle: 'externalData.nationalRegistry.description',
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
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
