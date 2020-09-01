import React, { useContext } from 'react'

import { UserContext } from '@island.is/air-discount-scheme-web/context'
import { copyToClipboard } from '@island.is/air-discount-scheme-web/utils'
import { Discount } from '@island.is/air-discount-scheme-web/graphql/schema'
import { Box, Typography, Button } from '@island.is/island-ui/core'

interface PropTypes {
  discount: Discount
  misc: string
}

function FullyUsed({ discount, misc }: PropTypes) {
  const { user: authUser } = useContext(UserContext)
  const { discountCode, expires, nationalId, user } = discount
  const {
    myRights,
    remaining,
    copyCode,
    codeDescription,
    kidsRights,
  } = JSON.parse(misc)

  const remainingPlaceholders = {
    remaining: user.fund.credit,
    total: user.fund.total,
  }

  return (
    <Box
      padding={2}
      borderWidth="standard"
      borderColor="mint400"
      borderStyle="solid"
      background="mint100"
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
        <Typography variant="p">
          {remaining.replace(
            /\{{(.*?)\}}/g,
            (m, sub) => remainingPlaceholders[sub],
          )}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography>Allir kóðar fullnýttir</Typography>
      </Box>
    </Box>
  )
}

export default FullyUsed
