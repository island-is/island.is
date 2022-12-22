import styles from './european-health-insurance-card.module.scss'
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

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCard: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardApplicationForm',
  title: 'temp title',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicant',
      title: 'temp title',
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
