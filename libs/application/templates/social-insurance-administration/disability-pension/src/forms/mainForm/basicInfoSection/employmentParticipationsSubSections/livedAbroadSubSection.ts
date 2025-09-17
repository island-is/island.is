import {
  buildMultiField,
  buildRadioField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import { SectionRouteEnum } from '../../../../types/routes'
import { getApplicationExternalData, yesOrNoOptions } from '../../../../utils'
import * as m from '../../../../lib/messages'
import addYears from 'date-fns/addYears'
import addDays from 'date-fns/addDays'

const livedAbroadCondition = (formValue: FormValue) => {
  const livedAbroad = getValueViaPath<YesOrNoEnum>(
    formValue,
    `${SectionRouteEnum.LIVED_ABROAD}.hasLivedAbroad`,
  )
  return livedAbroad === YES
}

export const livedAbroadSubSection = buildMultiField({
  id: SectionRouteEnum.LIVED_ABROAD,
  title: m.employmentParticipation.livedAbroadTitle,
  description: m.employmentParticipation.livedAbroadDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.LIVED_ABROAD}.hasLivedAbroad`,
      width: 'half',
      required: true,
      options: yesOrNoOptions,
    }),
    buildTableRepeaterField({
      id: `${SectionRouteEnum.LIVED_ABROAD}.list`,
      condition: livedAbroadCondition,
      formTitle: m.employmentParticipation.livedAbroadTitle,
      addItemButtonText: m.employmentParticipation.addCountry,
      saveItemButtonText: m.employmentParticipation.save,
      removeButtonTooltipText: m.employmentParticipation.remove,
      fields: {
        country: {
          component: 'select',
          label: m.employmentParticipation.country,
          placeholder: m.employmentParticipation.countryPlaceholder,
          width: 'half',
          required: true,
          displayInTable: false,
          isSearchable: true,
          options: (application: Application) => {
            const { countries = [] } = getApplicationExternalData(
              application.externalData,
            )
            return countries.map(({ label, value }) => ({
              value,
              label,
            }))
          },
        },
        abroadNationalId: {
          component: 'input',
          label: m.employmentParticipation.abroadNationalId,
          width: 'half',
        },
        periodStart: {
          component: 'date',
          label: m.employmentParticipation.periodStart,
          placeholder: m.employmentParticipation.periodStartPlaceholder,
          required: true,
          width: 'half',
          maxDate: (_, activeField) => {
            if (activeField?.periodEnd) {
              const endDate = new Date(activeField.periodEnd)
              return addDays(endDate, -1)
            }
            return addDays(new Date(), -1)
          },
          minDate: () => addYears(new Date(), -50),
          displayInTable: false,
        },
        periodEnd: {
          component: 'date',
          label: m.employmentParticipation.periodEnd,
          placeholder: m.employmentParticipation.periodEndPlaceholder,
          required: true,
          width: 'half',
          displayInTable: false,
          maxDate: () => new Date(),
          minDate: (_, activeField) => {
            return activeField?.periodStart ?
              addDays(new Date(activeField.periodStart), 1)
            : addDays(addYears(new Date(), -50), 1)
          },
        },
        period: {
          component: 'hiddenInput',
          updateValueObj: {
            valueModifier: (_, activeField) => {
              if (!activeField) {
                return ''
              }

              const { periodStart, periodEnd } = activeField

              if (!periodStart || !periodEnd) {
                return ''
              }

              const dateStart = new Date(periodStart)
              const dateEnd = new Date(periodEnd)

              if (!dateStart || !dateEnd) {
                return ''
              }

              const formattedDateStart = format(dateStart, 'MMMM yyyy')
              const formattedDateEnd = format(dateEnd, 'MMMM yyyy')

              return `${formattedDateStart} - ${formattedDateEnd}`
            },
            watchValues: ['periodStart', 'periodEnd'],
          },
        },
        countryDisplay: {
          component: 'hiddenInput',
          updateValueObj: {
            valueModifier: (application, activeField) => {
              if (!activeField) {
                return ''
              }

              const { country } = activeField
              if (!country) {
                return ''
              }

              const { countries = [] } = getApplicationExternalData(
                application.externalData,
              )

              return countries.find((c) => c.value === country)?.label ?? ''
            },
            watchValues: ['country'],
          },
        },
      },
      table: {
        header: [
          m.employmentParticipation.country,
          m.employmentParticipation.abroadNationalId,
          m.employmentParticipation.period,
        ],
        rows: ['countryDisplay', 'abroadNationalId', 'period'],
      },
    }),
  ],
})
