import { Application, Option } from '@island.is/application/types'
import { formatCurrency } from '@island.is/shared/utils'
import { getSelectedProperty } from './propertyUtils'

export const notkunareiningarOptions = (
  application: Application,
): Array<Option> => {
  const fasteign = getSelectedProperty(
    application.answers,
    application.externalData,
  )

  return (
    fasteign?.notkunareiningar?.notkunareiningar?.map((notkunareining) => ({
      label: `${notkunareining.notkunBirting} - Brunabótamat: ${formatCurrency(
        notkunareining.brunabotamat ?? 0,
      )}`,
      value: notkunareining.notkunareininganumer ?? '',
    })) ?? []
  )
}
