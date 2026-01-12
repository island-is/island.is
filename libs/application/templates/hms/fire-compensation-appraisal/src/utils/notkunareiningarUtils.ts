import { Application, Option } from '@island.is/application/types'
import { getValueViaPath, YES } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { formatCurrency } from '@island.is/shared/utils'

export const notkunareiningarOptions = (
  application: Application,
): Array<Option> => {
  const otherPropertiesThanIOwn = getValueViaPath<string[]>(
    application.answers,
    'otherPropertiesThanIOwnCheckbox',
  )?.includes(YES)

  const selectedRealEstateId = otherPropertiesThanIOwn
    ? 'F' +
      getValueViaPath<string>(application.answers, 'selectedPropertyByCode')
    : getValueViaPath<string>(application.answers, 'realEstate')

  const fasteignir = otherPropertiesThanIOwn
    ? getValueViaPath<Array<Fasteign>>(application.answers, 'anyProperties')
    : getValueViaPath<Array<Fasteign>>(
        application.externalData,
        'getProperties.data',
      )

  const fasteign = fasteignir?.find(
    (fasteign) => fasteign.fasteignanumer === selectedRealEstateId,
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
