import React from 'react'

import { Approved } from '@island.is/application/ui-components'
import { Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import School from '../../assets/School'
import { m } from '../../lib/messages'

const EndorsementApproved = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={5} marginBottom={12}>
        <Approved
          title={formatMessage(m.endorsementApproved.cardTitle)}
          subtitle={formatMessage(m.endorsementApproved.cardSubtitle)}
        />
      </Box>
      <Box height="full" marginTop={8} marginBottom={10}>
        <School />
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="center"
        marginBottom={7}
      >
        <Button variant="ghost">
          <Link href={formatMessage(m.endorsementApproved.myPagesUrl)}>
            {formatMessage(m.endorsementApproved.myPagesButton)}
          </Link>
        </Button>
      </Box>
    </Box>
  )
}

export default EndorsementApproved
