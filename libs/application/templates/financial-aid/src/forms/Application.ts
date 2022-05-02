import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ApproveOptions, ExternalData } from '../lib/types'

import * as m from '../lib/messages'
import { Routes } from '../lib/constants'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'personalInterest',
      title: m.section.personalInterest,
      children: [
        buildSubSection({
          condition: (_, externalData) =>
            ((externalData as unknown) as ExternalData).nationalRegistry?.data
              ?.applicant?.spouse != null,
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
            ((externalData as unknown) as ExternalData).nationalRegistry?.data
              ?.applicant?.spouse == null,
          title: m.unknownRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'UnknownRelationship',
              title: m.unknownRelationship.general.pageTitle,
              component: 'UnknownRelationshipForm',
            }),
          ],
        }),
        buildSubSection({
          id: 'homeCircumstancesForm',
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
          id: 'studentForm',
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
          id: 'employmentForm',
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
          id: 'incomeFiles',
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
            ((externalData as unknown) as ExternalData).taxDataFetch?.data
              .municipalitiesDirectTaxPayments.success === false ||
            ((externalData as unknown) as ExternalData).taxDataFetch?.data
              ?.municipalitiesPersonalTaxReturn?.personalTaxReturn == null,
          id: 'taxReturnFilesForm',
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
          id: 'personalTaxCreditForm',
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
          id: 'bankInfoForm',
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
      id: 'contactInfoForm',
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
      id: 'summaryForm',
      title: m.summaryForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'summaryForm',
          title: m.summaryForm.general.pageTitle,
          children: [
            buildCustomField({
              id: 'summaryForm',
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
      id: 'confirmation',
      title: m.confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'applicantConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'ApplicantConfirmation',
        }),
      ],
    }),
  ],
})
