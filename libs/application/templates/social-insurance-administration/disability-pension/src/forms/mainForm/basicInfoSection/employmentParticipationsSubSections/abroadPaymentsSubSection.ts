import {
  buildMultiField,
  buildRadioField,
  buildTableRepeaterField,
  YES,
  getValueViaPath,
  YesOrNoEnum,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import { SectionRouteEnum } from '../../../../types'
import {  yesOrNoOptions } from '../../../../utils'
import { Country } from '../../../../types/interfaces'

const abroadPaymentsCondition = (formValue: FormValue) => {
  const hasAbroadPayments = getValueViaPath<YesOrNoEnum>(
    formValue,
    `${SectionRouteEnum.ABROAD_PAYMENT}.hasAbroadPayments`,
  )

  return hasAbroadPayments === YES
}

export const abroadPaymentsSubSection = buildMultiField({
  id: SectionRouteEnum.ABROAD_PAYMENT,
  title:
    disabilityPensionFormMessage.employmentParticipation.abroadPaymentsTitle,
  description:
    disabilityPensionFormMessage.employmentParticipation
      .abroadPaymentsDescription,
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
      formTitle:
        disabilityPensionFormMessage.employmentParticipation
          .abroadPaymentsTableTitle,
      addItemButtonText:
        disabilityPensionFormMessage.employmentParticipation.addCountry,
      saveItemButtonText:
        disabilityPensionFormMessage.employmentParticipation.save,
      removeButtonTooltipText:
        disabilityPensionFormMessage.employmentParticipation.remove,
      fields: {
        country: {
          component: 'select',
          label: disabilityPensionFormMessage.employmentParticipation.country,
          placeholder:
            disabilityPensionFormMessage.employmentParticipation
              .countryPlaceholder,
          width: 'half',
          displayInTable: true,
          isSearchable: true,
          options: (application: Application) => {
            const countries = getValueViaPath<Array<Country>>(
              application.externalData,
              'socialInsuranceAdministrationCountries.data',
            ) ?? []

            return countries.map(({ code, nameIcelandic }) => ({
              value: code,
              label: nameIcelandic,
            }))
          },
        },
        abroadNationalId: {
          component: 'input',
          label:
            disabilityPensionFormMessage.employmentParticipation
              .abroadNationalId,
          width: 'half',
          placeholder: '000000-0000',
          format: '######-####',
          required: false,
          displayInTable: true,
        },
      },
      table: {
        header: [
          disabilityPensionFormMessage.employmentParticipation.country,
          disabilityPensionFormMessage.employmentParticipation.abroadNationalId,
        ],
        rows: ['country', 'abroadNationalId'],
      },
    }),
  ],
})
