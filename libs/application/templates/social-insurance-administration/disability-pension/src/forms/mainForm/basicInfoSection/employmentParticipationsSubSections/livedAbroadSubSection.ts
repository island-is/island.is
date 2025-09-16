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
          displayInTable: true,
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
          displayInTable: true,
        },
        //TODO: ONly month
        periodStart: {
          component: 'date',
          label: m.employmentParticipation.periodStart,
          placeholder: m.employmentParticipation.periodStartPlaceholder,
          width: 'half',
          displayInTable: false,
          updateValueObj: {
            valueModifier: (_, activeField) => {
              if (!activeField) {
                return ''
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
                const newDate = addMonths(dateEnd, -1)
                return format(newDate, 'yyyy-MM-dd')
              }

              return activeField.periodStart
            },
            watchValues: ['periodEnd'],
          },
        },
        //TODO: ONly month
        periodEnd: {
          component: 'date',
          label: m.employmentParticipation.periodEnd,
          placeholder: m.employmentParticipation.periodEndPlaceholder,
          width: 'half',
          displayInTable: false,
          updateValueObj: {
            valueModifier: (_, activeField) => {
              if (!activeField) {
                return ''
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
                const newDate = addMonths(dateStart, 1)
                return format(newDate, 'yyyy-MM-dd')
              }

              return activeField.periodEnd
            },
            watchValues: ['periodStart'],
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
