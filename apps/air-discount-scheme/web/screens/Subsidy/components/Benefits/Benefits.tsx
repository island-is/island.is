import React, { useEffect, useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { UserContext } from '@island.is/air-discount-scheme-web/context'
import { Box, Typography, Button } from '@island.is/island-ui/core'
import { HasCredit, NoCredit, FullyUsed } from '../'

interface PropTypes {
  misc: string
}

const FetchDiscountsMutation = gql`
  mutation FetchDiscountsMutation {
    fetchDiscounts {
      discountCode
      expires
      nationalId
      user {
        nationalId
        name
        fund {
          nationalId
          used
          credit
          total
        }
        meetsADSRequirements
      }
    }
  }
`

function Benefits({ misc }: PropTypes) {
  const [fetchDiscounts, { data }] = useMutation(FetchDiscountsMutation)
  useEffect(() => {
    fetchDiscounts()
  }, [fetchDiscounts])

  const { fetchDiscounts: discounts } = data || {}
  const {
    myRights,
    remaining,
    copyCode,
    codeDescription,
    kidsRights,
  } = JSON.parse(misc)

  return (
    <Box marginBottom={6}>
      <Box marginBottom={3}>
        <Typography variant="h3">{myRights}</Typography>
      </Box>
      {discounts &&
        discounts.map((discount) => {
          const { user } = discount

          if (user.fund.used === user.fund.total) {
            return <FullyUsed misc={misc} discount={discount} />
          } else if (!user.meetsADSRequirements) {
            return <NoCredit misc={misc} discount={discount} />
          } else {
            return <HasCredit misc={misc} discount={discount} />
          }
        })}
      <Box textAlign="right" marginBottom={4}>
        <Typography variant="pSmall">{codeDescription}</Typography>
      </Box>
    </Box>
  )
}

export default Benefits
