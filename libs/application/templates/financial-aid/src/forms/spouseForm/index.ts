import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'

import * as m from '../../lib/messages'
import { ApproveOptions, ExternalData } from '../../lib/types'
import { Routes } from '../../lib/constants'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { spouseIncomeSection } from './spouseIncomeSection'
import { spouseContactInfoSection } from './spouseContactInfoSection'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    spouseIncomeSection,
    buildSection({
      condition: (answers) => {
        const income = getValueViaPath<ApproveOptions>(
          answers,
          Routes.SPOUSEINCOME,
        )
        return income === ApproveOptions.Yes
      },
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
    spouseContactInfoSection,
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
