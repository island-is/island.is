import React from 'react'
import { AlertMessage, Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

interface EndorsementApprovedProps {
  hasEndorsedBefore?: boolean
}

const EndorsementApproved = ({
  hasEndorsedBefore,
}: EndorsementApprovedProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={12}>
        {!hasEndorsedBefore && (
          <Approved
            title={formatMessage(m.endorsementApproved.cardTitle)}
            subtitle={formatMessage(m.endorsementApproved.cardSubtitle)}
          />
        )}
        {hasEndorsedBefore && (
          <AlertMessage
            type="warning"
            title={formatMessage(m.endorsementApproved.cardTitleWarning)}
            message={formatMessage(m.endorsementApproved.cardSubtitle)}
          />
        )}
      </Box>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Button variant="ghost">
          <Link href="https://island.is/minarsidur/min-gogn/minar-upplysingar">
            {formatMessage(m.endorsementApproved.myPagesButton)}
          </Link>
        </Button>
      </Box>
    </Box>
  )
}

export default EndorsementApproved
