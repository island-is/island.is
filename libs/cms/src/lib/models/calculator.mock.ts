import { ICalculator } from '../generated/contentfulTypes'

// TEMPORARY — approximates real Contentful `calculator` entries for the PoC,
// since the content type doesn't exist in any Contentful environment yet.
// Delete once real entries exist and this is no longer needed to exercise
// the pipeline end-to-end. Field keys match libs/api/domains/rsk-calculators'
// mapper.ts exactly, since the frontend's field-key picker validates against
// that live list.
const withholdingTaxOnWagesEntry: ICalculator = {
  sys: {
    id: 'mock-withholding-tax-on-wages',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Staðgreiðsla launa (mock)',
    calculatorType: 'withholdingTaxOnWages',
    configJson: {
      calculatorType: 'withholdingTaxOnWages',
      sections: [
        {
          key: 'payments',
          title: 'Launagreiðslur',
          fields: [
            { key: 'salary', span: 7 },
            { key: 'incomeYear', span: 5 },
          ],
        },
        {
          key: 'contributions',
          title: 'Iðgjald',
          fields: [
            { key: 'pensionFundRatio', span: 6 },
            { key: 'privatePensionRatio', span: 6 },
          ],
        },
        {
          key: 'personalTaxCredit',
          title: 'Persónuafsláttur',
          description: 'Uppsafnaður og milli hjóna',
          fields: [
            { key: 'taxCardUtilization', span: 4 },
            { key: 'spouseTaxCardUtilization', span: 4 },
            { key: 'accumulatedPersonalTaxCredit', span: 4 },
          ],
        },
        {
          key: 'deductions',
          title: 'Frádráttur',
          fields: [
            { key: 'vacationPay', span: 4 },
            { key: 'unionDues', span: 4 },
            { key: 'otherDeduction', span: 4 },
          ],
        },
        {
          key: 'employerPayments',
          title: 'Aðrar greiðslur launagreiðanda',
          fields: [
            { key: 'employerPensionMatchRatio', span: 4 },
            { key: 'vehicleAllowance', span: 4 },
            { key: 'seamenAccidentInsurancePremium', span: 4 },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

const childBenefitEntry: ICalculator = {
  sys: {
    id: 'mock-child-benefit',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Barnabætur (mock)',
    calculatorType: 'childBenefit',
    configJson: {
      calculatorType: 'childBenefit',
      sections: [
        {
          key: 'main',
          title: '',
          fields: [
            { key: 'marriedOrCohabiting', span: 12 },
            { key: 'incomeYear', span: 12 },
            { key: 'incomeBase', span: 12 },
            { key: 'numberOfChildren', span: 12 },
            { key: 'numberOfChildrenUnder7', span: 12 },
            { key: 'splitCustody', span: 12 },
            {
              key: 'splitCustodyChildrenOver7',
              span: 12,
              visibleWhen: { field: 'splitCustody', equals: 'true' },
            },
            {
              key: 'splitCustodyChildrenUnder7',
              span: 12,
              visibleWhen: { field: 'splitCustody', equals: 'true' },
            },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

export const mockCalculatorEntries: ICalculator[] = [
  withholdingTaxOnWagesEntry,
  childBenefitEntry,
]
