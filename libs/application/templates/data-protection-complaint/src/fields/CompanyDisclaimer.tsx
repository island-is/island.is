import React, { FC } from 'react'

import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Button, Link, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { info } from '../lib/messages'

export const CompanyDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h5" fontWeight="regular">
      <b>ATH. </b>
      {formatText(info.labels.companyDisclaimer, application, formatMessage)}
    </Text>
  )
}
