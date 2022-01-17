import {
  buildCustomField,
  buildForm,
  buildSection,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ExternalData } from '../lib/types'

import * as m from '../lib/messages'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      condition: (_, externalData) =>
        ((externalData as unknown) as ExternalData).nationalRegistry?.data
          ?.spouse !== undefined,
      id: 'personalInterest',
      title: m.section.personalInterest,
      children: [
        buildSubSection({
          title: m.inRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'inRelationship',
              title: m.inRelationship.general.pageTitle,
              component: 'InRelationshipForm',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'homeCircumstancesForm',
      title: m.homeCircumstancesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'homeCircumstances',
          title: m.homeCircumstancesForm.general.pageTitle,
          component: 'HomeCircumstancesForm',
        }),
      ],
    }),
    buildSection({
      id: 'studentForm',
      title: m.studentForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'student',
          title: m.studentForm.general.pageTitle,
          component: 'StudentForm',
        }),
      ],
    }),
    buildSection({
      id: 'employmentForm',
      title: m.employmentForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'employmentForm',
          title: m.employmentForm.general.pageTitle,
          component: 'EmploymentForm',
        }),
      ],
    }),
    buildSection({
      id: 'incomeForm',
      title: m.incomeForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'income',
          title: m.incomeForm.general.pageTitle,
          component: 'IncomeForm',
        }),
      ],
    }),
    buildSection({
      id: 'personalTaxCreditForm',
      title: m.personalTaxCreditForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'personalTaxCreditForm',
          title: m.personalTaxCreditForm.general.pageTitle,
          component: 'PersonalTaxCreditForm',
        }),
      ],
    }),
    buildSection({
      id: 'bankInfoForm',
      title: m.bankInfoForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'bankInfoForm',
          title: m.bankInfoForm.general.pageTitle,
          component: 'BankInfoForm',
        }),
      ],
    }),
    buildSection({
      id: 'summaryForm',
      title: m.summaryForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'summaryForm',
          title: m.summaryForm.general.pageTitle,
          component: 'SummaryForm',
        }),
      ],
    }),
    // This is here to be able to show submit button on former screen :( :( :(
    buildSection({
      id: '',
      title: '',
      children: [
        buildCustomField({
          id: '',
          title: '',
          component: '',
        }),
      ],
    }),
  ],
})
