import {
  buildMultiField,
  buildRadioField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
  buildTableRepeaterField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import format from 'date-fns/format'
import { SectionRouteEnum } from '../../../../types/routes'
import { getApplicationExternalData, yesOrNoOptions } from '../../../../utils'
import * as m from '../../../../lib/messages'
import addYears from 'date-fns/addYears'
import addDays from 'date-fns/addDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'

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
    buildDescriptionField({
      id: `${SectionRouteEnum.LIVED_ABROAD}.listTitle`,
      title: m.employmentParticipation.livedAbroadQuestion,
      condition: livedAbroadCondition,
      titleVariant: 'h5',
      space: 5,
    }),
    buildTableRepeaterField({
      id: `${SectionRouteEnum.LIVED_ABROAD}.list`,
      marginTop: 0,
      condition: livedAbroadCondition,
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
              const end = parseISO(activeField.periodEnd)
              if (isValid(end)) return addDays(end, -1)
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
            if (activeField?.periodStart) {
              const start = parseISO(activeField.periodStart)
              if (isValid(start)) return addDays(start, 1)
            }
            return addDays(addYears(new Date(), -50), 1)
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
              const start = parseISO(periodStart)
              const end = parseISO(periodEnd)

              if (!isValid(start) || !isValid(end)) {
                return ''
              }

              const formattedDateStart = format(start, 'MMMM yyyy')
              const formattedDateEnd = format(end, 'MMMM yyyy')

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
