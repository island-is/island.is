import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { getMonths, getYears } from '../../../../utils/dates'

export const disabilityPeriodFields = buildMultiField({
  id: SectionRouteEnum.DISABILITY_PERIOD,
  title: disabilityPensionFormMessage.disabilityPeriod.title,
  description: disabilityPensionFormMessage.disabilityPeriod.description,
  children: [
    buildTitleField({
      title: disabilityPensionFormMessage.disabilityPeriod.chooseDate,
      titleVariant: 'h5',
    }),
    buildSelectField({
      id: `${SectionRouteEnum.DISABILITY_PERIOD}.year`,
      title: disabilityPensionFormMessage.shared.year,
      width: 'half',
      placeholder: disabilityPensionFormMessage.shared.chooseYear,
      required: true,
      options: () => {
        //TODO: Validate that the user is not selecting more than two years (calculate months as well)
        const years = getYears(2)
        return years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.DISABILITY_PERIOD}.month`,
      title: disabilityPensionFormMessage.shared.month,
      width: 'half',
      required: true,
      placeholder: disabilityPensionFormMessage.shared.chooseMonth,
      options: () => {
        const months = getMonths()
        return months.map((month) => ({
          value: month.toString(),
          label: month.toString(),
        }))
      },
    }),
  ],
})
