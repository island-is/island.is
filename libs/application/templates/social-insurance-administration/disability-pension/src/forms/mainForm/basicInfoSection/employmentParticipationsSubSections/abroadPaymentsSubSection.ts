import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { SectionRouteEnum } from '../../../../types/routes'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  yesOrNoOptions,
} from '../../../../utils'
import * as m from '../../../../lib/messages'

const abroadPaymentsCondition = (formValue: FormValue) => {
  const { isReceivingBenefitsFromAnotherCountry } =
    getApplicationAnswers(formValue)
  return isReceivingBenefitsFromAnotherCountry === YES
}

export const abroadPaymentsSubSection = buildMultiField({
  id: SectionRouteEnum.ABROAD_PAYMENT,
  title: m.employmentParticipation.abroadPaymentsTitle,
  description: m.employmentParticipation.abroadPaymentsDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.ABROAD_PAYMENT}.hasAbroadPayments`,
      width: 'half',
      required: true,
      options: yesOrNoOptions,
    }),
    buildDescriptionField({
      id: `${SectionRouteEnum.ABROAD_PAYMENT}.listTitle`,
      title: m.employmentParticipation.abroadPaymentsTableTitle,
      condition: abroadPaymentsCondition,
      titleVariant: 'h5',
      space: 5,
    }),
    buildTableRepeaterField({
      id: `${SectionRouteEnum.ABROAD_PAYMENT}.list`,
      condition: abroadPaymentsCondition,
      marginTop: 0,
      addItemButtonText: m.employmentParticipation.addCountry,
      saveItemButtonText: m.employmentParticipation.save,
      removeButtonTooltipText: m.employmentParticipation.remove,
      fields: {
        country: {
          component: 'select',
          label: m.employmentParticipation.country,
          placeholder: m.employmentParticipation.countryPlaceholder,
          width: 'half',
          isSearchable: true,
          displayInTable: false,
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
          required: true,
          label: m.employmentParticipation.abroadNationalId,
          width: 'half',
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
