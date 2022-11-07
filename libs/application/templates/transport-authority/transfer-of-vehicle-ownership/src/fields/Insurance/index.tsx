import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
export const CoOwner: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const { id } = field

  const insuranceCompanyList = getValueViaPath(
    application.externalData,
    'insuranceCompanyList.data',
    [],
  ) as InsuranceCompany[]

  return null
}
