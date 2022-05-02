import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'
import { ApproveOptions, ExternalData } from '../lib/types'
import { Routes } from '../lib/constants'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    // TODO: check if reusing components will work for the summary page
    buildSection({
      id: 'incomeForm',
      title: m.incomeForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSEINCOME,
          title: m.incomeForm.general.pageTitle,
          component: 'IncomeForm',
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.spouseIncome === ApproveOptions.Yes,
      id: 'incomeFilesForm',
      title: m.incomeFilesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSEINCOMEFILES,
          title: m.incomeFilesForm.general.pageTitle,
          component: 'IncomeFilesForm',
        }),
      ],
    }),
    buildSection({
      condition: (_, externalData) =>
        ((externalData as unknown) as ExternalData).taxDataFetchSpouse
          ?.status === 'failure',
      id: 'taxReturnFilesForm',
      title: m.taxReturnForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSETAXRETURNFILES,
          title: m.taxReturnForm.general.pageTitle,
          component: 'TaxReturnFilesForm',
        }),
      ],
    }),
    buildSection({
      id: 'contactInfoForm',
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSECONTACTINFO,
          title: m.contactInfo.general.pageTitle,
          component: 'ContactInfo',
        }),
      ],
    }),
    buildSection({
      id: 'summaryForm',
      title: m.summaryForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'summaryForm',
          title: m.summaryForm.general.pageTitle,
          children: [
            buildCustomField({
              id: 'spouseSummaryForm',
              title: m.summaryForm.general.pageTitle,
              component: 'SpouseSummaryForm',
            }),
            buildSubmitField({
              id: 'submitApplication',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.summaryForm.general.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'spouseConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'SpouseConfirmation',
        }),
      ],
    }),
  ],
})
