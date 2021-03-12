import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Typography,
  Stack,
  IconDeprecated as Icon,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { UserCredit, UserConnection, NoBenefits } from '../'
import { Status } from '../UserCredit/UserCredit'

const TEN_SECONDS = 10000 // milli-seconds

interface PropTypes {
  misc: string
}

const DiscountsQuery = gql`
  query DiscountsQuery {
    discounts {
      connectionDiscountCodes {
        code
        flightId
        validUntil
      }
      discountCode
      expiresIn
      nationalId
      user {
        nationalId
        name
        fund {
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
  const { data, loading, called } = useQuery(DiscountsQuery, {
    ssr: false,
    pollInterval: TEN_SECONDS,
  })

  const { discounts = [] } = data || {}
  const {
    myRights,
    codeDescription,
    attention,
    codeDisclaimer,
    connectionFlightHeader,
  } = JSON.parse(misc)
  const benefits = discounts.filter(({ user }) => user.meetsADSRequirements)
  const hasBenefits = benefits.length > 0
  const connections = discounts.filter(
    ({ connectionDiscountCodes }) => connectionDiscountCodes.length > 0,
  )
  const hasConnections = connections.length > 0
  return (
    <Box marginBottom={6}>
      {hasBenefits && !loading && called && (
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
            {benefits.map((discount, index) => {
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
            })}
            <Box textAlign="right">
              <Typography variant="pSmall">{codeDescription}</Typography>
            </Box>
          </>
        ) : (loading && !called) || loading ? (
          <SkeletonLoader height={98} repeat={2} space={3} />
        ) : (
          <NoBenefits misc={misc} />
        )}
      </Stack>

      {hasConnections ? (
        <>
          <Stack space={3}>
            <Typography variant="h3">{connectionFlightHeader}</Typography>
            {connections.map((discount, index) => {
              const { user } = discount
              const fundUsed = user.fund.used === user.fund.total
              const status: Status = fundUsed ? 'fundUsed' : 'default'
              return (
                <UserConnection
                  key={index}
                  misc={misc}
                  discount={discount}
                  status={status}
                />
              )
            })}
            <Box textAlign="right">
              <Typography variant="pSmall">{codeDescription}</Typography>
            </Box>
          </Stack>
        </>
      ) : (loading && !called) || loading ? (
        <Stack space={3}>
          <SkeletonLoader height={98} repeat={2} space={3} />
        </Stack>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default Benefits
