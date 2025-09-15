import {
  buildMultiField,
  buildRadioField,
  buildTableRepeaterField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { SectionRouteEnum } from '../../../../types'
import { getApplicationExternalData, yesOrNoOptions } from '../../../../utils'
import * as m from '../../../../lib/messages'

const abroadPaymentsCondition = (formValue: FormValue) => {
  const hasAbroadPayments = getValueViaPath<YesOrNoEnum>(
    formValue,
    `${SectionRouteEnum.ABROAD_PAYMENT}.hasAbroadPayments`,
  )

  return hasAbroadPayments === YES
}

export const abroadPaymentsSubSection = buildMultiField({
  id: SectionRouteEnum.ABROAD_PAYMENT,
  title: m.employmentParticipation.abroadPaymentsTitle,
  description: m.employmentParticipation.abroadPaymentsDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.ABROAD_PAYMENT}.hasAbroadPayments`,
      width: 'half',
      backgroundColor: 'blue',
      required: true,
      options: yesOrNoOptions,
    }),
    buildTableRepeaterField({
      id: `${SectionRouteEnum.ABROAD_PAYMENT}.list`,
      condition: abroadPaymentsCondition,
      formTitle: m.employmentParticipation.abroadPaymentsTableTitle,
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
        abroadNationalId: {
          component: 'input',
          label: m.employmentParticipation.abroadNationalId,
          width: 'half',
          required: false,
          displayInTable: true,
        },
      },
      table: {
        header: [
          m.employmentParticipation.country,
          m.employmentParticipation.abroadNationalId,
        ],
        rows: ['countryDisplay', 'abroadNationalId'],
      },
    }),
  ],
})
