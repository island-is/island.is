import React, { FC } from 'react'
import { formatText, FieldBaseProps } from '@island.is/application/core'
import { Box, Inline, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './TextWithTooltip.treat'

import { m } from '../../forms/messages'

const TextWithTooltip: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={6} className={styles.MarginFix}>
      <Text as="span">
        {formatText(m.formerInsuranceEntitlement, application, formatMessage)}{' '}
        <Tooltip
          placement="top"
          text={formatText(
            m.formerInsuranceEntitlementTooltip,
            application,
            formatMessage,
          )}
        />
      </Text>
    </Box>
  )
}

export default TextWithTooltip
