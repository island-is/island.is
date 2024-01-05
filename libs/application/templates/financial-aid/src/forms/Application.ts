import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { ApproveOptions, ExternalData } from '../lib/types'

import * as m from '../lib/messages'
import { Routes } from '../lib/constants'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'personalInterest',
      title: m.section.personalInterest,
      children: [
        buildSubSection({
          condition: (_, externalData) =>
            (externalData as unknown as ExternalData).nationalRegistrySpouse
              .data != null,
          title: m.inRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.INRELATIONSHIP,
              title: m.inRelationship.general.pageTitle,
              component: 'InRelationshipForm',
            }),
          ],
        }),
        buildSubSection({
          condition: (_, externalData) =>
            (externalData as unknown as ExternalData).nationalRegistrySpouse
              .data == null,
          title: m.unknownRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.UNKNOWNRELATIONSHIP,
              title: m.unknownRelationship.general.pageTitle,
              component: 'UnknownRelationshipForm',
            }),
          ],
        }),
        buildSubSection({
          id: Routes.HOMECIRCUMSTANCES,
          title: m.homeCircumstancesForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.HOMECIRCUMSTANCES,
              title: m.homeCircumstancesForm.general.pageTitle,
              component: 'HomeCircumstancesForm',
            }),
          ],
        }),
        buildSubSection({
          id: Routes.STUDENT,
          title: m.studentForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.STUDENT,
              title: m.studentForm.general.pageTitle,
              component: 'StudentForm',
            }),
          ],
        }),
        buildSubSection({
          id: Routes.EMPLOYMENT,
          title: m.employmentForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.EMPLOYMENT,
              title: m.employmentForm.general.pageTitle,
              component: 'EmploymentForm',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'finances',
      title: m.section.finances,
      children: [
        buildSubSection({
          id: Routes.INCOME,
          title: m.incomeForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.INCOME,
              title: m.incomeForm.general.pageTitle,
              component: 'IncomeForm',
            }),
          ],
        }),
        buildSubSection({
          condition: (answers) => answers.income === ApproveOptions.Yes,
          id: Routes.INCOMEFILES,
          title: m.incomeFilesForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.INCOMEFILES,
              title: m.incomeFilesForm.general.pageTitle,
              component: 'IncomeFilesForm',
            }),
          ],
        }),
        buildSubSection({
          condition: (_, externalData) =>
            (externalData as unknown as ExternalData).taxData?.data
              .municipalitiesDirectTaxPayments.success === false ||
            (externalData as unknown as ExternalData).taxData?.data
              ?.municipalitiesPersonalTaxReturn?.personalTaxReturn == null,
          id: Routes.TAXRETURNFILES,
          title: m.taxReturnForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.TAXRETURNFILES,
              title: m.taxReturnForm.general.pageTitle,
              component: 'TaxReturnFilesForm',
            }),
          ],
        }),
        buildSubSection({
          id: Routes.PERSONALTAXCREDIT,
          title: m.personalTaxCreditForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.PERSONALTAXCREDIT,
              title: m.personalTaxCreditForm.general.pageTitle,
              component: 'PersonalTaxCreditForm',
            }),
          ],
        }),
        buildSubSection({
          id: Routes.BANKINFO,
          title: m.bankInfoForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: Routes.BANKINFO,
              title: m.bankInfoForm.general.pageTitle,
              component: 'BankInfoForm',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.CONTACTINFO,
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.CONTACTINFO,
          title: m.contactInfo.general.pageTitle,
          component: 'ContactInfo',
        }),
      ],
    }),
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
