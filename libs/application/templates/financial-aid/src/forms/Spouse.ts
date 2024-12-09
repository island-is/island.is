import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import * as m from '../lib/messages'
import { ApproveOptions, ExternalData } from '../lib/types'
import { Routes } from '../lib/constants'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: Routes.SPOUSEINCOME,
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
      id: Routes.SPOUSEINCOMEFILES,
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
        (externalData as unknown as ExternalData)?.taxDataSpouse?.data
          ?.municipalitiesDirectTaxPayments?.success === false ||
        (externalData as unknown as ExternalData)?.taxDataSpouse?.data
          ?.municipalitiesPersonalTaxReturn?.personalTaxReturn == null,
      id: Routes.SPOUSETAXRETURNFILES,
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
      id: Routes.SPOUSECONTACTINFO,
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
      id: Routes.SPOUSESUMMARY,
      title: m.summaryForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.SPOUSESUMMARY,
          title: m.summaryForm.general.pageTitle,
          children: [
            buildCustomField({
              id: Routes.SPOUSESUMMARY,
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
      id: Routes.SPOUSECONFIRMATION,
      title: m.confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSECONFIRMATION,
          title: m.confirmation.general.pageTitle,
          component: 'SpouseConfirmation',
        }),
      ],
    }),
  ],
})
