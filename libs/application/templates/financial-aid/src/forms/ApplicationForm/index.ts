import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  Application,
} from '@island.is/application/types'

import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { personalInterestSection } from './personalInterestSection'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { financeSection } from './financeSection'
import { contactInfoSection } from './contactInfoSection'

export const ApplicationForm: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    personalInterestSection,
    financeSection,
    contactInfoSection,
    buildSection({
      id: Routes.SUMMARY,
      title: m.summaryForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.SUMMARY,
          title: m.summaryForm.general.pageTitle,
          children: [
            buildCustomField({
              id: Routes.SUMMARY,
              title: m.summaryForm.general.pageTitle,
              component: 'SummaryForm',
            }),
            buildSubmitField({
              id: 'submitApplication',
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
      id: Routes.CONFIRMATION,
      title: m.confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.CONFIRMATION,
          title: m.confirmation.general.pageTitle,
          component: 'ApplicantConfirmation',
        }),
      ],
    }),
  ],
})
