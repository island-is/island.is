import React, { useEffect, useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { UserContext } from '@island.is/air-discount-scheme-web/context'
import { copyToClipboard } from '@island.is/air-discount-scheme-web/utils'
import { Box, Typography, Button } from '@island.is/island-ui/core'

interface PropTypes {
  misc: string
}

const FetchDiscountsMutation = gql`
  mutation FetchDiscountsMutation {
    fetchDiscounts {
      discountCode
      expires
      nationalId
      flightLegFund {
        unused
        total
      }
      user {
        nationalId
        name
      }
    }
  }
`

function Benefits({ misc }: PropTypes) {
  const [fetchDiscounts, { data }] = useMutation(FetchDiscountsMutation)
  const { user: authUser } = useContext(UserContext)
  useEffect(() => {
    fetchDiscounts()
  }, [fetchDiscounts])

  const { fetchDiscounts: codes } = data || {}
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
      {codes &&
        codes.map(
          ({ discountCode, expires, nationalId, flightLegFund, user }) => {
            const remainingPlaceholders = {
              remaining: flightLegFund.unused,
              total: flightLegFund.total,
            }

            return (
              <Box
                key={discountCode}
                padding={2}
                marginBottom={2}
                border="standard"
                borderRadius="standard"
                display={['block', 'flex']}
                justifyContent="spaceBetween"
                alignItems={['flexStart', 'center']}
                background="blue100"
                flexDirection={['column', 'row']}
              >
                <Box marginBottom={[3, 0]}>
                  <Typography variant="h3">
                    {user.name}{' '}
                    {user.nationalId !== authUser.nationalId && kidsRights}
                  </Typography>
                  <Typography variant="p">
                    {remaining.replace(
                      /\{{(.*?)\}}/g,
                      (m, sub) => remainingPlaceholders[sub],
                    )}
                  </Typography>
                </Box>
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
              </Box>
            )
          },
        )}
      <Box textAlign="right" marginBottom={4}>
        <Typography variant="pSmall">{codeDescription}</Typography>
      </Box>
    </Box>
  )
}

export default Benefits
