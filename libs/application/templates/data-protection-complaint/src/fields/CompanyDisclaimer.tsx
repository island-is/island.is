import { Button, Link, Text } from 'libs/island-ui/core/src'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { info } from '../lib/messages'

export const CompanyDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h5" fontWeight="regular">
      <b>ATH. </b>
      {formatText(
        info.labels.companyDisclaimer,
        application,
        formatMessage,
      )}{' '}
      <Link href="https://something.com">
        <Button variant="text" size="small" icon="open" iconType="outline">
          {formatText(
            info.labels.companyDisclaimerButtonLabel,
            application,
            formatMessage,
          )}
        </Button>
      </Link>
    </Text>
  )
}
