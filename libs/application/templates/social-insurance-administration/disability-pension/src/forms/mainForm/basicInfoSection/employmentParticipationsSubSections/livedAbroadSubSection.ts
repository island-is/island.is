import {
  buildMultiField,
  buildRadioField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import { YesOrNoOptions, countryOptions } from '../../../../lib/options'

const livedAbroadRoute = `livedAbroad`

/** TODO
 * 1. Choose yes or no, if yes, require at least 1 row of living abroad data. If no, continue.
 * 2. If no rows yet, display 4 inputs and block continue until 1 row has been added.
 * 3. If row added, hide 4 inputs and use table repeater. Also ,unblock continue button.
 * 4. On Continue, validate each and every row.
 */

const livedAbroadCondition = (formValue: FormValue) => {
  const livedAbroad = getValueViaPath<YesOrNoEnum>(
    formValue,
    `${livedAbroadRoute}.hasLivedAbroad`,
  )

  return livedAbroad === YES
}

export const livedAbroadSubSection = buildMultiField({
  id: livedAbroadRoute,
  title: disabilityPensionFormMessage.employmentParticipation.livedAbroadTitle,
  description:disabilityPensionFormMessage.employmentParticipation.livedAbroadDescription,
  children: [
    buildRadioField({
      id: `${livedAbroadRoute}.hasLivedAbroad`,
      width: 'half',
      backgroundColor: 'blue',
      required: true,
      options: YesOrNoOptions
    }),
    buildTableRepeaterField({
      id: `${livedAbroadRoute}.list`,
      condition: livedAbroadCondition,
      formTitle: disabilityPensionFormMessage.employmentParticipation.livedAbroadTableTitle,
      addItemButtonText: disabilityPensionFormMessage.employmentParticipation.addCountry,
      saveItemButtonText: disabilityPensionFormMessage.employmentParticipation.save,
      removeButtonTooltipText: disabilityPensionFormMessage.employmentParticipation.remove,
      fields: {
        //TODO: FROM SMÁRI
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
        //TODO: ONly month
        periodStart: {
          component: 'date',
          label: disabilityPensionFormMessage.employmentParticipation.periodStart,
          placeholder: disabilityPensionFormMessage.employmentParticipation.periodStartPlaceholder,
          width: 'half',
          displayInTable: false,
          updateValueObj: {
            valueModifier: (_,  activeField) => {
              if (!activeField) {
                return ""
              }
              const { periodEnd, periodStart } = activeField

              if (!periodStart || !periodEnd) {
                return activeField.periodStart
              }
              const dateStart = new Date(periodStart)
              const dateEnd = new Date(periodEnd)

              if (!dateStart || !dateEnd) {
                return activeField.periodStart
              }

              if (dateStart.getMonth() > dateEnd.getMonth()) {
                const newDate = addMonths(dateEnd, -1);
                return format(newDate, 'yyyy-MM-dd');
              }

              return activeField.periodStart
            },
            watchValues: ['periodEnd']
          },
        },
        //TODO: ONly month
        periodEnd: {
          component: 'date',
          label: disabilityPensionFormMessage.employmentParticipation.periodEnd,
          placeholder: disabilityPensionFormMessage.employmentParticipation.periodEndPlaceholder,
          width: 'half',
          displayInTable: false,
          updateValueObj: {
            valueModifier: (_,  activeField) => {
              if (!activeField) {
                return ""
              }
              const { periodEnd, periodStart } = activeField

              if (!periodStart || !periodEnd) {
                return activeField.periodEnd
              }

              const dateStart = new Date(periodStart)
              const dateEnd = new Date(periodEnd)

              if (!dateStart || !dateEnd) {
                return activeField.periodEnd
              }

              if (dateEnd.getMonth() < dateStart.getMonth()) {
                const newDate = addMonths(dateStart, 1);
                return format(newDate, 'yyyy-MM-dd');
              }

              return activeField.periodEnd
            },
            watchValues: ['periodStart']
          },
        },
        period: {
          component: 'hiddenInput',
          updateValueObj: {
            valueModifier: (_, activeField) => {
              if (!activeField) {
                return ""
              }

              const { periodStart, periodEnd } = activeField

              if (!periodStart || !periodEnd) {
                return ""
              }

              const dateStart = new Date(periodStart)
              const dateEnd = new Date(periodEnd)

              if (!dateStart || !dateEnd) {
                return ""
              }

              const formattedDateStart = format(dateStart, 'MMMM yyyy')
              const formattedDateEnd = format(dateEnd, 'MMMM yyyy')

              return `${formattedDateStart} - ${formattedDateEnd}`
            },
          watchValues: ['periodStart', 'periodEnd']
          }
          },
      },
      table: {
        header: [disabilityPensionFormMessage.employmentParticipation.country, disabilityPensionFormMessage.employmentParticipation.abroadNationalId,disabilityPensionFormMessage.employmentParticipation.period],
        rows: ['country', 'abroadNationalId', 'period'],
      }
    }),
  ],
})
