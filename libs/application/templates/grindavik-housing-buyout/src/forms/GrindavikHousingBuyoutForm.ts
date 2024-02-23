import {
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  applicantInformationMessages,
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import {
  formatCurrency,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { GrindavikHousingBuyout } from '../lib/dataSchema'
import { calculateTotalLoanFromAnswers } from '../utils'

export const GrindavikHousingBuyoutForm: Form = buildForm({
  id: 'GrindavikHousingBuyoutDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.sectionTitle,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'propertyInformationSection',
      title: m.application.propertyInformation.sectionTitle,
      children: [
        buildMultiField({
          id: 'propertyInformationMultiField',
          title: m.application.propertyInformation.sectionTitle,
          description: m.application.propertyInformation.sectionDescription,
          children: [
            // TODO: Add data provider for property information
            buildStaticTableField({
              title: 'Vesturhóp 34, 240 Grindavík',
              header: [
                'Þinglýstir eigendur',
                'Kennitala',
                'Heimild',
                'Eignarhlutfall',
                'Brunabótamat',
              ],
              rows: (application) => {
                const data = application.externalData.nationalRegistry
                  .data as NationalRegistryIndividual

                return [
                  [
                    data.fullName,
                    data.nationalId,
                    'Afsal',
                    '100%',
                    formatCurrency('84500000'),
                  ],
                ]
              },
              summary: (_application) => {
                return {
                  label: m.application.overview.buyoutPriceTitle,
                  value: formatCurrency('80275000'),
                }
              },
            }),
            buildDescriptionField({
              id: '',
              title: '',
              marginTop: 4,
              description: m.application.propertyInformation.explaination,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'loanStatusSection',
      title: m.application.loanStatus.sectionTitle,
      children: [
        buildTableRepeaterField({
          id: 'loans',
          marginTop: 2,
          title: m.application.loanStatus.sectionTitle,
          description: m.application.loanStatus.addLoanDescription,
          addItemButtonText: m.application.loanStatus.addNewLoan,
          saveItemButtonText: m.application.loanStatus.saveNewLoan,
          fields: {
            status: {
              component: 'input',
              label: m.application.loanStatus.statusOfLoan,
              currency: true,
            },
            provider: {
              component: 'input',
              label: m.application.loanStatus.loanProvider,
            },
          },
          table: {
            format: {
              status: (v) => formatCurrency(v),
            },
          },
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.application.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: m.application.overview.sectionTitle,
          description: m.application.overview.sectionDescription,
          space: 3,
          children: [
            buildDividerField({}),

            // Applicant
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.application.overview.applicantTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.name,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as GrindavikHousingBuyout).applicant.name,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.nationalId,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as GrindavikHousingBuyout).applicant.nationalId,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.email,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as GrindavikHousingBuyout).applicant.email,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.tel,
              colSpan: '6/12',
              condition: (answers) =>
                !!(answers as GrindavikHousingBuyout)?.applicant?.phoneNumber,
              value: ({ answers }) =>
                formatPhoneNumber(
                  (answers as GrindavikHousingBuyout).applicant.phoneNumber,
                ),
            }),
            buildDividerField({}),

            // Property
            buildDescriptionField({
              id: 'propertyOverview',
              title: m.application.overview.propertyTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: 'Vesturhóp 34, 240 Grindavík',
            }),
            buildDividerField({}),

            // Compensation assessment
            buildDescriptionField({
              id: 'compensationAssessmentOverview',
              title: m.application.overview.compensationAssessmentTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: formatCurrency('84500000'),
            }),
            buildDividerField({}),

            // Payout
            buildDescriptionField({
              id: 'buyoutPriceOverview',
              title: m.application.overview.buyoutPriceTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: formatCurrency('80275000'),
            }),
            buildDividerField({}),

            // Total loan
            buildDescriptionField({
              id: 'totalLoanOverview',
              title: m.application.overview.totalLoanTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: ({ answers }) => {
                const total = calculateTotalLoanFromAnswers(answers)
                return formatCurrency(total?.toString() ?? '0')
              },
            }),
            buildDividerField({}),

            buildSubmitField({
              id: 'submit',
              title: m.application.general.submit,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.application.general.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({}),
  ],
})
