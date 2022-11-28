import React, { useState } from 'react'
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
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
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

type CopiedCode = {
  code: string
  copied: boolean
}

export const AirDiscountOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(AirDiscountQuery)
  const [copiedCodes, setCopiedCodes] = useState<CopiedCode[]>([])
  const airDiscounts = data?.getDiscount

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

  const copy = (code: string) => {
    copyToClipboard(code)
    const newCode: CopiedCode = { code: code, copied: true }
    setCopiedCodes([...copiedCodes, newCode])
    toast.success(formatMessage(m.codeCopiedSuccess))
  }

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.introTitle)}
          intro={defineMessage(m.introDescription)}
        />
        <Text variant="small" paddingBottom={2}>
          {formatMessage(m.discountText)}
        </Text>
        <AlertMessage
          type="warning"
          title={formatMessage(m.attention)}
          message={formatMessage(m.codeRenewalText)}
        />
      </Box>
      {loading && <CardLoader />}
      {data && (
        <Box marginBottom={3}>
          <Text variant="eyebrow" paddingBottom={1}>
            {formatMessage(m.myRights)}
          </Text>
          <Stack space={2}>
            {airDiscounts?.map((item) => {
              const message = [
                formatMessage(m.remainingAirfares),
                item.user.fund?.credit,
                formatMessage(m.of),
                item.user.fund?.total,
              ]
                .filter((x) => x !== null)
                .join(' ')
              const isCopied = copiedCodes.find(
                (x) => x.code === item.discountCode,
              )?.copied
              return (
                <ActionCard
                  heading={item.user.name}
                  text={message}
                  secondaryText={item.discountCode}
                  cta={{
                    label: formatMessage(m.copyCode),
                    onClick: () => copy(item.discountCode),
                    disabled: item.user.fund?.credit === 0,
                    centered: true,
                    icon: isCopied ? 'checkmark' : 'copy',
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
