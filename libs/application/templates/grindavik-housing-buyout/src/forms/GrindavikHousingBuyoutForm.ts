import {
  buildCheckboxField,
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
import { Form, FormModes } from '@island.is/application/types'
import {
  applicantInformationMessages,
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import {
  formatCurrency,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { GrindavikHousingBuyout } from '../lib/dataSchema'
import {
  calculateBuyoutPrice,
  calculateTotalLoanFromAnswers,
  getFireInsuranceValue,
  getPropertyAddress,
  getPropertyOwners,
} from '../utils'
import { format as formatNationalId } from 'kennitala'

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
            buildStaticTableField({
              title: ({ externalData }) => getPropertyAddress(externalData),
              header: [
                m.application.propertyInformation.propertyOwners,
                m.application.propertyInformation.ownerNationalId,
                m.application.propertyInformation.propertyPermit,
                m.application.propertyInformation.ownershipRatio,
              ],
              rows: ({ externalData }) => {
                const owners = getPropertyOwners(externalData)

                return owners.map((owner) => [
                  owner.nafn ?? '',
                  formatNationalId(owner.kennitala ?? ''),
                  owner.heimildBirting ?? '',
                  `${(owner.eignarhlutfall ?? 0) * 100}%`,
                ])
              },
              summary: ({ externalData }) => {
                const fireInsuranceValue = getFireInsuranceValue(externalData)
                return {
                  label: m.application.propertyInformation.fireInsuranceValue,
                  value: formatCurrency(fireInsuranceValue.toString()),
                }
              },
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
      id: 'results',
      title: m.application.results.sectionTitle,
      children: [
        buildMultiField({
          id: 'resultsMultiField',
          title: m.application.results.sectionTitle,
          space: 3,
          children: [
            buildDescriptionField({
              id: '',
              title: '',
              description: (application) => {
                const {
                  buyoutPrice,
                  buyoutPriceWithLoans,
                  fireInsuranceValue,
                  totalLoans,
                  closingPayment,
                  result,
                } = calculateBuyoutPrice(application)

                return {
                  ...m.application.propertyInformation.explaination,
                  values: {
                    fireInsuranceValue: formatCurrency(
                      fireInsuranceValue.toString(),
                    ),
                    buyoutPrice: formatCurrency(buyoutPrice.toString()),
                    buyoutPriceWithLoans: formatCurrency(
                      buyoutPriceWithLoans.toString(),
                    ),
                    totalLoans: formatCurrency(totalLoans.toString()),
                    closingPayment: formatCurrency(closingPayment.toString()),
                    result: formatCurrency(result.toString()),
                  },
                }
              },
            }),
          ],
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
                formatNationalId(
                  (answers as GrindavikHousingBuyout).applicant.nationalId,
                ),
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
                  removeCountryCode(
                    (answers as GrindavikHousingBuyout).applicant.phoneNumber,
                  ),
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
              value: ({ externalData }) => getPropertyAddress(externalData),
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
              value: ({ externalData }) => {
                const fireInsuranceValue = getFireInsuranceValue(externalData)
                return formatCurrency(fireInsuranceValue.toString())
              },
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
              value: (application) => {
                const { buyoutPrice } = calculateBuyoutPrice(application)
                return formatCurrency(buyoutPrice.toString())
              },
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
                return formatCurrency(total.toString())
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
