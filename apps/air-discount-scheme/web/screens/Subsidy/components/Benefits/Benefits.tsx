import React, { useContext } from 'react'

import { UserContext } from '@island.is/air-discount-scheme-web/context'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import format from 'date-fns/format'

import {
  Box,
  Typography,
  Stack,
  IconDeprecated as Icon,
  SkeletonLoader,
  Text,
  ToastContainer,
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { NoBenefits, CodeCard } from '../'

const ONE_MINUTE = 1000 * 60 // milli-seconds

interface PropTypes {
  misc: string
}

const DiscountsQuery = gql`
  query DiscountsQuery {
    discounts {
      connectionDiscountCodes {
        code
        flightDesc
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
    pollInterval: ONE_MINUTE,
  })
  const { user: authUser } = useContext(UserContext)
  const { discounts = [] } = data || {}
  const {
    myRights,
    codeDescription,
    attention,
    codeDisclaimer,
    connectionFlightHeader,
    remaining,
    copyCode,
    kidsRights,
    usedFund,
    path,
    validUntil,
    copySuccess,
    connectionFlightInfo,
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
        {hasBenefits ? (
          <>
            <Typography variant="h3">{myRights}</Typography>
            {(loading && !called) || loading ? (
              <SkeletonLoader height={98} repeat={2} space={3} />
            ) : (
              benefits.map((discount, index) => {
                const { discountCode, user } = discount
                const fundUsed = user.fund.used === user.fund.total
                const remainingPlaceholders = {
                  remaining: user.fund.credit,
                  total: user.fund.total,
                }
                return (
                  <CodeCard
                    key={index}
                    title={`${user.name} ${
                      user?.nationalId !== authUser?.nationalId
                        ? kidsRights
                        : ''
                    }`}
                    subTitle={remaining.replace(
                      /\{{(.*?)\}}/g,
                      (m, sub) => remainingPlaceholders[sub],
                    )}
                    noCodeMessage={usedFund}
                    code={fundUsed ? null : discountCode}
                    copyCodeText={copyCode}
                    variant={fundUsed ? 'disabled' : 'default'}
                    onCopy={() => {
                      toast.success(copySuccess)
                    }}
                  />
                )
              })
            )}
            <Box textAlign="right">
              <Typography variant="pSmall">{codeDescription}</Typography>
            </Box>
            {hasConnections && (
              <Box marginTop={[6, 6, 12]}>
                <Stack space={3}>
                  <Typography variant="h3">
                    {connectionFlightHeader}{' '}
                    <Tooltip text={connectionFlightInfo} />
                  </Typography>
                  {connections.map((discount) => {
                    const { connectionDiscountCodes, user } = discount
                    return connectionDiscountCodes.map(
                      (connectionFlight, index) => {
                        return (
                          <CodeCard
                            key={index}
                            title={`${user.name} ${
                              user?.nationalId !== authUser?.nationalId
                                ? kidsRights
                                : ''
                            }`}
                            subTitle={`${path}: ${connectionFlight.flightDesc}`}
                            codeSubText={
                              <>
                                {validUntil}:{' '}
                                <Text fontWeight="semiBold" as="span">
                                  {format(
                                    new Date(connectionFlight.validUntil),
                                    'kk:mm dd.MM.yy',
                                  )}
                                </Text>
                              </>
                            }
                            code={connectionFlight.code}
                            copyCodeText={copyCode}
                            variant="secondary"
                            onCopy={() => {
                              toast.success(copySuccess)
                            }}
                          />
                        )
                      },
                    )
                  })}
                </Stack>
              </Box>
            )}
          </>
        ) : (
          <NoBenefits misc={misc} />
        )}
      </Stack>
      <ToastContainer />
    </Box>
  )
}

export default Benefits
