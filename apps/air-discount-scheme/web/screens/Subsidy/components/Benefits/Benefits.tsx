import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Typography,
  Stack,
  Icon,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { UserCredit, NoBenefits } from '../'
import { Status } from '../UserCredit/UserCredit'

const TEN_SECONDS = 10000 // milli-seconds

interface PropTypes {
  misc: string
}

const DiscountsQuery = gql`
  query DiscountsQuery {
    discounts {
      discountCode
      expiresIn
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
  const { data, loading, called, refetch } = useQuery(DiscountsQuery, {
    ssr: false,
  })
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, TEN_SECONDS)
    return () => clearInterval(interval)
  }, [refetch])

  const { discounts = [] } = data || {}
  const { myRights, codeDescription, attention, codeDisclaimer } = JSON.parse(
    misc,
  )
  const benefits = discounts.filter(({ user }) => user.meetsADSRequirements)
  const hasBenefits = !(benefits.length <= 0 && !loading && called)
  return (
    <Box marginBottom={6}>
      {hasBenefits && (
        <Box
          marginBottom={8}
          background="yellow200"
          borderColor="yellow400"
          borderWidth="standard"
          borderStyle="solid"
          borderRadius="standard"
          display="flex"
          alignItems="center"
          padding={3}
        >
          <Box marginRight={2}>
            <Icon type="alert" color="yellow600" width={26} />
          </Box>
          <Box marginRight={2}>
            <Typography variant="p">
              <strong>{attention}</strong>
            </Typography>
          </Box>
          <Typography variant="p">{codeDisclaimer}</Typography>
        </Box>
      )}

      <Stack space={3}>
        <Typography variant="h3">{myRights}</Typography>
        {hasBenefits ? (
          <>
            {loading && !called ? (
              <SkeletonLoader height={98} />
            ) : (
              benefits.map((discount, index) => {
                const { user } = discount
                const fundUsed = user.fund.used === user.fund.total
                const status: Status = fundUsed ? 'fundUsed' : 'default'
                return (
                  <UserCredit
                    key={index}
                    misc={misc}
                    discount={discount}
                    status={status}
                  />
                )
              })
            )}
            <Box textAlign="right">
              <Typography variant="pSmall">{codeDescription}</Typography>
            </Box>
          </>
        ) : (
          <NoBenefits misc={misc} />
        )}
      </Stack>
    </Box>
  )
}

export default Benefits
