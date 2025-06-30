import {
  buildMultiField,
  buildRadioField,
  buildTableRepeaterField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { YesOrNoOptions, countryOptions } from '../../../../lib/utils'
import { FormValue } from '@island.is/application/types'

const abroadPaymentsRoute = `abroadPayments`

const abroadPaymentsCondition = (formValue: FormValue) => {
  const hasAbroadPayments = getValueViaPath<YesOrNoEnum>(
    formValue,
    `${abroadPaymentsRoute}.hasAbroadPayments`,
  )

  return hasAbroadPayments === YES
}

export const abroadPaymentsSubSection = buildMultiField({
  id: abroadPaymentsRoute,
  title: disabilityPensionFormMessage.employmentParticipation.abroadPaymentsTitle,
  description: disabilityPensionFormMessage.employmentParticipation.abroadPaymentsDescription,
  children: [
    buildRadioField({
      id: `${abroadPaymentsRoute}.hasAbroadPayments`,
      width: 'half',
      backgroundColor: 'blue',
      required: true,
      options: YesOrNoOptions,
    }),
    buildTableRepeaterField({
      id: `${abroadPaymentsRoute}.list`,
      condition: abroadPaymentsCondition,
      formTitle: disabilityPensionFormMessage.employmentParticipation.abroadPaymentsTableTitle,
      addItemButtonText: disabilityPensionFormMessage.employmentParticipation.addCountry,
      saveItemButtonText: disabilityPensionFormMessage.employmentParticipation.save,
      removeButtonTooltipText: disabilityPensionFormMessage.employmentParticipation.remove,
      fields: {
        country: {
          component: 'select',
          label: disabilityPensionFormMessage.employmentParticipation.country,
          placeholder: disabilityPensionFormMessage.employmentParticipation.countryPlaceholder,
          width: 'half',
          displayInTable: true,
          isSearchable: true,
          options: countryOptions,
        },
        abroadNationalId: {
          component: 'input',
          label: disabilityPensionFormMessage.employmentParticipation.abroadNationalId,
          width: 'half',
          format: '######-####',
          displayInTable: true,
        },
      },
      table: {
        header: [disabilityPensionFormMessage.employmentParticipation.country, disabilityPensionFormMessage.employmentParticipation.abroadNationalId],
        rows: ['country', 'abroadNationalId'],
      }
    }),
  ],
})
