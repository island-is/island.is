import React, { useContext } from 'react'

import { UserContext } from '@island.is/air-discount-scheme-web/context'
import { copyToClipboard } from '@island.is/air-discount-scheme-web/utils'
import { Discount } from '@island.is/air-discount-scheme-web/graphql/schema'
import { Box, Typography, Button } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

type Status = {
  background: Colors
  borderColor: Colors
}

const boxStatus: { [key: string]: Status } = {
  success: {
    background: 'mint100',
    borderColor: 'mint400',
  },
  error: {
    background: 'red100',
    borderColor: 'red200',
  },
  default: {
    background: 'blue100',
    borderColor: 'blue200',
  },
}

interface PropTypes {
  discount: Discount
  misc: string
  status?: keyof typeof boxStatus
}

function UserCredit({ discount, misc, status = 'default' }: PropTypes) {
  const { user: authUser } = useContext(UserContext)
  const { discountCode, user } = discount
  const {
    remaining,
    copyCode,
    kidsRights,
    usedFund,
    noRightsToFund,
  } = JSON.parse(misc)

  const remainingPlaceholders = {
    remaining: user.fund.credit,
    total: user.fund.total,
  }

  return (
    <Box
      {...boxStatus[status]}
      padding={2}
      borderWidth="standard"
      borderStyle="solid"
      borderRadius="standard"
      display={['block', 'flex']}
      justifyContent="spaceBetween"
      alignItems={['flexStart', 'center']}
      flexDirection={['column', 'row']}
    >
      <Box marginBottom={[3, 0]}>
        <Typography variant="h3">
          {user.name} {user.nationalId !== authUser.nationalId && kidsRights}
        </Typography>
        {status !== 'error' && (
          <Typography variant="p">
            {remaining.replace(
              /\{{(.*?)\}}/g,
              (m, sub) => remainingPlaceholders[sub],
            )}
          </Typography>
        )}
      </Box>
      {status === 'success' ? (
        <Typography variant="h5">{usedFund}</Typography>
      ) : status === 'error' ? (
        <Typography variant="h5">{noRightsToFund}</Typography>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent={['spaceBetween', 'flexStart']}
        >
          <Box marginRight={[2, 4]}>
            <Typography variant="h3" color="roseTinted400">
              {discountCode}
            </Typography>
          </Box>
          <Button
            noWrap
            onClick={() => {
              copyToClipboard(discountCode)
            }}
          >
            {copyCode}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default UserCredit
