import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { terms } from '../../lib/messages'

export const TermsOfAgreement: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box background="blue100" padding={3} borderRadius="large" marginBottom={3}>
      <Link
        href={formatText(
          terms.values.termsAgreementUrl,
          application,
          formatMessage,
        )}
      >
        <Button icon="open" iconType="outline" variant="text">
          {formatText(
            terms.labels.termsAgreementLinkTitle,
            application,
            formatMessage,
          )}
        </Button>
      </Link>
    </Box>
  )
}
