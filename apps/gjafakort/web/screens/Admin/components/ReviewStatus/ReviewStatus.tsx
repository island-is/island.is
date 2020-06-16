import React from 'react'
import Link from 'next/link'

import { Icon, Box, Button, Typography } from '@island.is/island-ui/core'

import { KeyValue } from '../../../../components'

interface PropTypes {
  approved: number
  pending: number
  rejected: number
}

function ReviewStatus({ approved, pending, rejected }: PropTypes) {
  return (
    <Box background="purple100" padding={4} marginBottom={3}>
      <Box marginBottom={2}>
        <Typography variant="h4">Staða umsókna</Typography>
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <KeyValue
          label="Samþykktar"
          value={approved}
          color="blue400"
          size="h2"
        />
        <KeyValue label="Eftir" value={pending} size="h2" />
        <KeyValue label="Hafnaðar" value={rejected} size="h2" />
      </Box>
      <Box textAlign="right">
        <Link href="/admin/summary">
          <span>
            <Button variant="text" size="small">
              Sjá nánar
              <Box alignItems="center" display="flex">
                <Icon type="arrowRight" width={12} />
              </Box>
            </Button>
          </span>
        </Link>
      </Box>
    </Box>
  )
}

export default ReviewStatus
