import {
  buildMultiField,
  buildRadioField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
  buildTableRepeaterField,
  buildDescriptionField,
  buildSelectField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import {  YesOrNoOptions, countryOptions } from '../../../../lib/utils'
import { FormValue } from '@island.is/application/types'
import format from 'date-fns/format'

const livedAbroadRoute = `livedAbroad`

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
      addItemButtonText: 'add',
      saveItemButtonText: 'save',
      removeButtonTooltipText: 'remove',
      fields: {
        country: {
          component: 'select',
          label: disabilityPensionFormMessage.employmentParticipation.country,
          placeholder: disabilityPensionFormMessage.employmentParticipation.countryPlaceholder,
          width: 'half',
          displayInTable: false,
          isSearchable: true,
          options: countryOptions,
        },
        abroadNationalId: {
          component: 'input',
          label: disabilityPensionFormMessage.employmentParticipation.abroadNationalId,
          width: 'half',
          format: '######-####',
          displayInTable: false,
          required: true,
        },
        periodStart: {
          component: 'date',
          label: disabilityPensionFormMessage.employmentParticipation.periodStart,
          placeholder: disabilityPensionFormMessage.employmentParticipation.periodStartPlaceholder,
          width: 'half',
          displayInTable: false,
          required: true,
        },
        periodEnd: {
          component: 'date',
          label: disabilityPensionFormMessage.employmentParticipation.periodEnd,
          placeholder: disabilityPensionFormMessage.employmentParticipation.periodEndPlaceholder,
          width: 'half',
          displayInTable: false,
          required: true,
        },
        period: {
          component: 'hiddenInput',
          updateValueObj: {
            valueModifier: (application, activeField) => {
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
