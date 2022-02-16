import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildSection,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ApproveOptions, ExternalData } from '../lib/types'

import * as m from '../lib/messages'
import { routes } from '../lib/constants'

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
              ?.applicant?.spouse !== undefined,
          title: m.inRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: routes.INRELATIONSHIP,
              title: m.inRelationship.general.pageTitle,
              component: 'InRelationshipForm',
            }),
          ],
        }),
        buildSubSection({
          condition: (_, externalData) =>
            ((externalData as unknown) as ExternalData).nationalRegistry?.data
              ?.applicant?.spouse === undefined,
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
              id: routes.HOMECIRCUMSTANCES,
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
              id: routes.STUDENT,
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
              id: routes.EMPLOYMENT,
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
          id: routes.INCOME,
          title: m.incomeForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: routes.INCOME,
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
              id: routes.PERSONALTAXCREDIT,
              title: m.incomeFilesForm.general.pageTitle,
              component: 'IncomeFilesForm',
            }),
          ],
        }),
        buildSubSection({
          id: 'personalTaxCreditForm',
          title: m.personalTaxCreditForm.general.sectionTitle,
          children: [
            buildCustomField({
              id: routes.PERSONALTAXCREDIT,
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
              id: routes.BANKINFO,
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
          id: routes.CONTACTINFO,
          title: m.contactInfo.general.pageTitle,
          component: 'ContactInfo',
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
    buildSection({
      id: 'confirmation',
      title: m.confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'confirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
