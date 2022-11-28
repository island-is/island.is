import React, { useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  IntroHeader,
  ServicePortalModuleComponent,
  m as coreMessage,
  ActionCard,
  EmptyState,
  CardLoader,
} from '@island.is/service-portal/core'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, Stack } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { messages as m } from '../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'

const AirDiscountQuery = gql`
  query AirDiscountQuery {
    getDiscount {
      nationalId
      discountCode
      connectionDiscountCodes {
        code
        flightId
        flightDesc
        validUntil
      }
      expiresIn
      user {
        name
        fund {
          credit
          used
          total
        }
      }
    }
  }
`
export const AirDiscountOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(AirDiscountQuery)

  const airDiscounts = data?.getDiscount
  console.log(airDiscounts)

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessage.errorTitle)}
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.licenses).toLowerCase(),
        })}
      />
    )
  }

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.introTitle)}
          intro={defineMessage(m.introDescription)}
        />
      </Box>
      {loading && <CardLoader />}
      {data && (
        <Box marginBottom={3}>
          <Stack space={2}>
            {airDiscounts?.map((item) => {
              const disabled = item.user.fund?.credit === 0
              return (
                <ActionCard
                  heading={item.user.name}
                  text={
                    formatMessage(m.remainingAirfares) +
                    item.user.fund?.credit +
                    formatMessage(m.of) +
                    item.user.fund?.total
                  }
                  cta={{
                    label: formatMessage(m.copyCode),
                    onClick: () => copyToClipboard(item.discountCode),
                    disabled,
                  }}
                />
              )
            })}
          </Stack>
        </Box>
      )}

      {!loading && !error && airDiscounts?.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
    </>
  )
}

export default AirDiscountOverview
