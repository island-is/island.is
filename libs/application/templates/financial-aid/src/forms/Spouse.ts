import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'

import * as m from '../lib/messages'
import { ApproveOptions, ExternalData } from '../lib/types'
import { Routes } from '../lib/constants'
import { createElement } from 'react'
import { Logo } from '../components/Logo/Logo'
import { incomeOptions } from '../utils/options'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.IN_PROGRESS,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildSection({
      id: Routes.SPOUSEINCOME,
      title: m.incomeForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'incomeMultiField',
          title: m.incomeForm.general.pageTitle,
          children: [
            buildRadioField({
              id: Routes.SPOUSEINCOME,
              width: 'half',
              options: incomeOptions,
              marginBottom: 2,
            }),
            buildHiddenInput({
              condition: (answers) => {
                const income = getValueViaPath<ApproveOptions>(
                  answers,
                  Routes.SPOUSEINCOME,
                )
                return income === ApproveOptions.Yes
              },
              id: 'incomeBulletlistTitleHidden',
            }),
            buildDescriptionField({
              id: 'incomeBulletlistTitle',
              title: m.incomeForm.bulletList.headline,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'incomeBulletList',
              description: m.incomeForm.bulletList.bullets,
            }),
          ],
        }),
      ],
    }),
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
    buildSection({
      id: Routes.SPOUSECONTACTINFO,
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'contactInfoMultiField',
          title: m.contactInfo.general.pageTitle,
          children: [
            buildDescriptionField({
              id: 'contactInfoDescription',
              description: m.contactInfo.general.description,
            }),
            buildTextField({
              id: `${Routes.SPOUSECONTACTINFO}.email`,
              title: m.contactInfo.emailInput.label,
              placeholder: m.contactInfo.emailInput.placeholder,
              defaultValue: (application: Application) => {
                const spouseEmail = getValueViaPath<string>(
                  application.answers,
                  'spouse.email',
                )
                const relationshipStatusSpouseEmail = getValueViaPath<string>(
                  application.answers,
                  'relationshipStatus.spouseEmail',
                )

                return spouseEmail || relationshipStatusSpouseEmail
              },
            }),
            buildTextField({
              id: `${Routes.SPOUSECONTACTINFO}.phone`,
              title: m.contactInfo.phoneInput.label,
              placeholder: m.contactInfo.phoneInput.placeholder,
              format: '###-####',
            }),
          ],
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
