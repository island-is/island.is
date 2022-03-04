import { Box, Text, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { confirmation } from '../../lib/messages/confirmation'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'
import * as styles from './ComplaintConfirmation.css'

export const ComplaintConfirmation: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Text>
        {formatMessage(confirmation.labels.description, {
          link: (
            <Link href={formatMessage(confirmation.labels.link)} newTab>
              <span className={styles.link}>
                {formatMessage(confirmation.labels.linkName)}
              </span>
            </Link>
          ),
        })}
      </Text>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
