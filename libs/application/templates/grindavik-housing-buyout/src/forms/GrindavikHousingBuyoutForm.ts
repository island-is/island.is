import {
  buildCheckboxField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  buildTableRepeaterField,
  coreMessages,
  YES,
  NO,
} from '@island.is/application/core'
import { Comparators, Form, FormModes } from '@island.is/application/types'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import {
  formatBankInfo,
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
  conclusionSection,
} from '../utils'
import { format as formatNationalId } from 'kennitala'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import addMonths from 'date-fns/addMonths'
import {
  OTHER_PROVIDER,
  PreemptiveRight,
  loanProviders,
  preemptiveRightLabels,
} from '../lib/constants'
import format from 'date-fns/format'
import { applicantInformationMultiField } from '../sections'

const loanProvidersOptions = [
  ...loanProviders.map((x) => ({ label: x, value: x })),
  { label: m.application.loanStatus.otherOrganization, value: OTHER_PROVIDER },
]

export const GrindavikHousingBuyoutForm: Form = buildForm({
  id: 'GrindavikHousingBuyoutDraft',
  title: m.application.general.name,
  logo: DistrictCommissionersLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.sectionTitle,
      children: [applicantInformationMultiField],
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
                return [
                  {
                    label: m.application.propertyInformation.fireInsuranceValue,
                    value: formatCurrency(fireInsuranceValue.toString()),
                  },
                ]
              },
            }),
            buildDescriptionField({
              id: 'dateTitle',
              title: m.application.propertyInformation.deliveryDateTitle,
              titleVariant: 'h3',
              marginTop: [4, 6],
              marginBottom: 1,
              description:
                m.application.propertyInformation.deliveryDateDescription,
            }),
            buildDateField({
              id: 'deliveryDate',
              defaultValue: '',
              title: m.application.propertyInformation.deliveryDateLabel,
              required: true,
              minDate: addMonths(new Date(), 1),
              maxDate: addMonths(new Date(), 4),
              placeholder:
                m.application.propertyInformation.deliveryDatePlaceholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalOwnersSection',
      title: m.application.additionalOwners.sectionTitle,
      condition: (_, externalData) => {
        const owners = getPropertyOwners(externalData)
        return owners.length > 1
      },
      children: [
        buildMultiField({
          id: 'additionalOwnersMultiField',
          title: m.application.additionalOwners.sectionTitle,
          description: m.application.additionalOwners.sectionDescription,
          children: [
            buildCustomField({
              id: 'additionalOwners',
              component: 'AdditionalOwnersRepeater',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'loanStatusSection',
      title: m.application.loanStatus.sectionTitle,
      children: [
        buildMultiField({
          id: 'loanStatusMultiField',
          title: m.application.loanStatus.sectionTitle,
          description: m.application.loanStatus.addLoanDescription,
          space: [4, 6],
          children: [
            buildTableRepeaterField({
              id: 'loanProviders.loans',
              marginTop: 2,
              addItemButtonText: m.application.loanStatus.addNewLoan,
              saveItemButtonText: m.application.loanStatus.saveNewLoan,
              fields: {
                provider: {
                  component: 'select',
                  label: m.application.loanStatus.loanProvider,
                  options: loanProvidersOptions,
                },
                otherProvider: {
                  component: 'input',
                  label: m.application.loanStatus.otherLoanProvider,
                  displayInTable: false,
                  condition: (_, activeField) => {
                    return (
                      (activeField &&
                        activeField.provider === OTHER_PROVIDER) ??
                      false
                    )
                  },
                },
                status: {
                  component: 'input',
                  label: m.application.loanStatus.statusOfLoan,
                  currency: true,
                },
              },
              table: {
                format: {
                  status: (v) => formatCurrency(v),
                  provider: (v) =>
                    v === OTHER_PROVIDER
                      ? m.application.loanStatus.otherOrganization
                          .defaultMessage
                      : v,
                },
              },
            }),
            buildCheckboxField({
              id: 'loanProviders.hasNoLoans',
              condition: (answers) => {
                const loans = (answers as GrindavikHousingBuyout)?.loanProviders
                  ?.loans
                return !loans || loans.length === 0
              },
              options: [
                {
                  label: m.application.loanStatus.checkboxText,
                  value: YES,
                },
              ],
            }),
          ],
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
              description: m.application.results.explaination,
            }),
            buildStaticTableField({
              header: [
                m.application.results.tableDescription,
                m.application.results.tableValue,
              ],
              rows: (application) => {
                const { fireInsuranceValue, buyoutPrice, totalLoans } =
                  calculateBuyoutPrice(application)
                return [
                  [
                    m.application.results.fireAssessment,
                    formatCurrency(fireInsuranceValue.toString()),
                  ],
                  [
                    m.application.results.buyoutPrice,
                    formatCurrency(buyoutPrice.toString()),
                  ],
                  [
                    m.application.results.totalLoan,
                    formatCurrency((-totalLoans).toString()),
                  ],
                ]
              },
              summary: (application) => {
                const { result, closingPayment, buyoutPriceWithLoans } =
                  calculateBuyoutPrice(application)
                return [
                  {
                    label: m.application.results.payment,
                    value: formatCurrency(result.toString()),
                  },
                  {
                    label: m.application.results.closingPayment,
                    value: formatCurrency(closingPayment.toString()),
                  },
                  {
                    label: m.application.results.total,
                    value: formatCurrency(buyoutPriceWithLoans.toString()),
                  },
                ]
              },
            }),
            buildDescriptionField({
              id: 'infoText',
              description: m.application.results.infoText,
            }),
            buildCheckboxField({
              id: 'confirmLoanTakeover',
              defaultValue: [],
              options: [
                {
                  label: m.application.results.confirmLoanTakeover,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'sellerStatement',
      title: m.application.sellerStatement.sectionTitle,
      children: [
        buildMultiField({
          id: 'sellerStatementMultiField',
          title: m.application.sellerStatement.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'sellerStatementText',
              description: m.application.sellerStatement.text,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'preemptiveRight',
      title: m.application.preemptiveRight.sectionTitle,
      children: [
        buildMultiField({
          id: 'preemptiveRightsMultiField',
          title: m.application.preemptiveRight.sectionTitle,
          description: m.application.preemptiveRight.description,
          children: [
            buildRadioField({
              id: 'preemptiveRight.preemptiveRightWish',
              title: m.application.overview.checkboxText,
              width: 'half',
              required: true,
              options: [
                { label: coreMessages.radioYes, value: YES },
                { label: coreMessages.radioNo, value: NO },
              ],
            }),
            buildCheckboxField({
              id: 'preemptiveRight.preemptiveRightType',
              title: m.application.overview.preemptiveRightTypeTitle,
              condition: {
                questionId: 'preemptiveRight.preemptiveRightWish',
                isMultiCheck: false,
                value: YES,
                comparator: Comparators.EQUALS,
              },
              options: [
                {
                  label: m.application.overview.purchaseRight,
                  value: PreemptiveRight.PURCHASE_RIGHT,
                },
                {
                  label: m.application.overview.prePurchaseRight,
                  value: PreemptiveRight.PRE_PURCHASE_RIGHT,
                },
                {
                  label: m.application.overview.preLeaseRight,
                  value: PreemptiveRight.PRE_LEASE_RIGHT,
                },
              ],
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
              titleVariant: 'h3',
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
            buildKeyValueField({
              label: m.application.applicant.bankInfo,
              colSpan: '6/12',
              value: ({ answers }) =>
                formatBankInfo(
                  (answers as GrindavikHousingBuyout).applicantBankInfo,
                ),
            }),
            buildDividerField({}),

            // Additional owners
            buildCustomField({
              id: 'additionalOwnersOverview',
              title: m.application.additionalOwners.sectionTitle,
              component: 'AdditionalOwnersOverview',
            }),

            // Property
            buildDescriptionField({
              id: 'propertyOverview',
              title: m.application.overview.propertyTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: '',
              value: ({ externalData }) => getPropertyAddress(externalData),
            }),
            buildKeyValueField({
              label: m.application.overview.compensationAssessmentTitle,
              colSpan: ['1/1', '6/12'],
              value: ({ externalData }) => {
                const fireInsuranceValue = getFireInsuranceValue(externalData)
                return formatCurrency(fireInsuranceValue.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.overview.buyoutPriceTitle,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { buyoutPrice } = calculateBuyoutPrice(application)
                return formatCurrency(buyoutPrice.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.overview.totalLoanTitle,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                const total = calculateTotalLoanFromAnswers(answers)
                return formatCurrency(total.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.propertyInformation.deliveryDateTitle,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                const date = (answers as GrindavikHousingBuyout).deliveryDate
                return format(new Date(date), 'dd.MM.yyyy')
              },
            }),
            buildDividerField({}),

            // Calculation
            buildDescriptionField({
              id: 'resultOverview',
              title: m.application.overview.resultTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.application.results.payment,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { result } = calculateBuyoutPrice(application)
                return formatCurrency(result.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.results.total,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { buyoutPriceWithLoans } =
                  calculateBuyoutPrice(application)
                return formatCurrency(buyoutPriceWithLoans.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.results.confirmLoanTakeover,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                return (
                  answers as GrindavikHousingBuyout
                ).confirmLoanTakeover?.includes(YES)
                  ? coreMessages.radioYes
                  : coreMessages.radioNo
              },
            }),
            buildDividerField({}),

            // Preemptive right
            buildDescriptionField({
              id: 'preemptiveRightOverview',
              title: m.application.preemptiveRight.sectionTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.application.overview.checkboxText,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                return (answers as GrindavikHousingBuyout).preemptiveRight
                  .preemptiveRightWish === YES
                  ? coreMessages.radioYes
                  : coreMessages.radioNo
              },
            }),
            buildKeyValueField({
              label: m.application.overview.preemptiveRightsLabel,
              colSpan: ['1/1', '6/12'],
              condition: (answers) => {
                const rights = (answers as GrindavikHousingBuyout)
                  .preemptiveRight?.preemptiveRightType
                return (rights && rights.length > 0) ?? false
              },
              value: ({ answers }) => {
                const rights = (answers as GrindavikHousingBuyout)
                  .preemptiveRight.preemptiveRightType
                return rights?.map((right) => preemptiveRightLabels[right])
              },
            }),

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
    conclusionSection,
  ],
})
