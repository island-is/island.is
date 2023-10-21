import { Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { info } from '../lib/messages'

export const CompanyDisclaimer: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h5" fontWeight="regular">
      <b>ATH. </b>
      {formatText(info.labels.companyDisclaimer, application, formatMessage)}
    </Text>
  )
}
