import {
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { application, income } from '../../lib/messages'
import {
  Application,
  ExternalData,
  FormValue,
  MultiField,
  SubSection,
} from '@island.is/application/types'
import { IncomeCheckboxValues } from '../../utils/enums'
import { GaldurDomainModelsRSKRSKIncomeListDTO } from '@island.is/clients/vmst-unemployment'
import { employmentHasNotEnded } from '../../utils/employmentHasNotEnded'
import { incomeFromOtherThanJobChecked } from '../../utils/incomeFromOtherThanJobChecked'
import { MAX_INCOME_PAGES, MONTHS } from '../../utils/constants'
import { Locale } from '@island.is/shared/types'

const buildRepeatableSections = (): SubSection[] => {
  const incomeBlocks = [...Array(MAX_INCOME_PAGES)].map((_key, index) => {
    return getIncomeSections(index)
  })

  const subSections = incomeBlocks.flat().map((incomeField, index) => {
    return buildSubSection({
      id: `incomeSubSection[${index}]`,
      title: {
        ...income.general.subSectionTitle,
        values: {
          index: index + 1,
        },
      },
      condition: (_, externalData: ExternalData) => {
        const incomeList = getValueViaPath<
          Array<GaldurDomainModelsRSKRSKIncomeListDTO>
        >(
          externalData,
          'activityGrantApplication.data.activationGrant.rskLatestIncomeList.incomeList',
        )
        if (!incomeList || incomeList.length === 0) return true
        return incomeList.length > index
      },
      children: [incomeField],
    })
  })
  return subSections
}

const getIncomeSections = (index: number) => {
  const fields: MultiField[] = [
    buildMultiField({
      id: `incomeMultiField[${index}]`,
      children: [
        buildDescriptionField({
          id: `income[${index}].taxInfo`,
          description: income.general.subSectionDescription,
        }),
        buildTextField({
          id: `income[${index}].employer`,
          readOnly: true,
          title: income.labels.employer,
          backgroundColor: 'white',
          defaultValue: (application: Application) => {
            const incomeList = getValueViaPath<
              Array<GaldurDomainModelsRSKRSKIncomeListDTO>
            >(
              application.externalData,
              'activityGrantApplication.data.activationGrant.rskLatestIncomeList.incomeList',
            )
            if (!incomeList || !incomeList[index]) return ''
            return incomeList[index].employerName
          },
          marginBottom: 4,
          doesNotRequireAnswer: true,
        }),
        buildTextField({
          id: `income[${index}].month`,
          readOnly: true,
          title: income.labels.incomeMonth,
          backgroundColor: 'white',
          defaultValue: (
            application: Application,
            externalData: ExternalData,
          ) => {
            const incomeList = getValueViaPath<
              Array<GaldurDomainModelsRSKRSKIncomeListDTO>
            >(
              application.externalData,
              'activityGrantApplication.data.activationGrant.rskLatestIncomeList.incomeList',
            )
            if (!incomeList || !incomeList[index]) return ''
            const startingLocale = getValueViaPath<Locale>(
              externalData,
              'startingLocale.data',
            )
            const month = incomeList[index]?.month
            if (month == null) return ''
            return startingLocale === 'en'
              ? MONTHS[month]?.en ?? ''
              : MONTHS[month]?.is
          },
          width: 'half',
          doesNotRequireAnswer: true,
        }),
        buildTextField({
          id: `income[${index}].salaryIncome`,
          readOnly: true,
          variant: 'currency',
          title: income.labels.salaryIncome,
          backgroundColor: 'white',
          defaultValue: (application: Application) => {
            const incomeList = getValueViaPath<
              Array<GaldurDomainModelsRSKRSKIncomeListDTO>
            >(
              application.externalData,
              'activityGrantApplication.data.activationGrant.rskLatestIncomeList.incomeList',
            )
            if (!incomeList || !incomeList[index]) return ''
            return incomeList[index].amount
          },
          width: 'half',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: `income[${index}].hasEmploymentEndedDescription`,
          title: income.labels.hasEmploymentEnded,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: `income[${index}].hasEmploymentEnded`,
          width: 'half',
          options: [
            { value: YES, label: application.yesLabel },
            { value: NO, label: application.noLabel },
          ],
          clearOnChange: [`income[${index}].endOfEmploymentDate`],
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: `income[${index}].endOfEmployment`,
          title: income.labels.endOfEmployment,
          titleVariant: 'h5',
          doesNotRequireAnswer: true,
          condition: (formValue: FormValue) => {
            return employmentHasNotEnded(index, formValue)
          },
        }),
        buildDateField({
          id: `income[${index}].endOfEmploymentDate`,
          title: income.labels.endOfEmploymentDate,
          doesNotRequireAnswer: true,
          condition: (formValue: FormValue) => {
            return employmentHasNotEnded(index, formValue)
          },
          minDate: new Date(),
          maxDate: () => {
            const today = new Date()
            const plusMonth = new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              today.getDate(),
            )
            return plusMonth
          },
        }),
        buildCheckboxField({
          id: `income[${index}].checkbox`,
          options: [
            {
              value: IncomeCheckboxValues.INCOME_FROM_OTHER_THAN_JOB,
              label: income.labels.incomeFromOtherThanJob,
            },
          ],
          clearOnChange: [`income[${index}].explanation`],
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: `income[${index}].explanationDescription`,
          title: income.labels.explanationDescription,
          titleVariant: 'h5',
          condition: (formValue: FormValue) => {
            return incomeFromOtherThanJobChecked(index, formValue)
          },
        }),
        buildTextField({
          id: `income[${index}].explanation`,
          title: income.labels.explanation,
          placeholder: income.labels.explanationPlaceholder,
          variant: 'textarea',
          rows: 4,
          maxLength: 200,
          showMaxLength: true,
          doesNotRequireAnswer: true,
          condition: (formValue: FormValue) => {
            return incomeFromOtherThanJobChecked(index, formValue)
          },
        }),
      ],
    }),
  ]

  return fields
}

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: income.general.sectionTitle,
  condition: (_, externalData: ExternalData) => {
    const incomeList = getValueViaPath<
      Array<GaldurDomainModelsRSKRSKIncomeListDTO>
    >(
      externalData,
      'activityGrantApplication.data.activationGrant.rskLatestIncomeList.incomeList',
    )
    if (!incomeList || incomeList.length === 0) return false
    return true
  },
  children: buildRepeatableSections(),
})
