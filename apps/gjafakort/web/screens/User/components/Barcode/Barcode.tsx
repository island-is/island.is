import React from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useMachine } from '@xstate/react'

import {
  Box,
  Stack,
  Typography,
  Button,
  Icon,
  Columns,
  Column,
  SkeletonLoader as SL,
} from '@island.is/island-ui/core'

import { ErrorPanel } from '@island.is/gjafakort-web/components'

import { barcodeMachine } from './barcodeMachine'
import { Countdown, RenderBarcode } from '..'

export const GiftCardsQuery = gql`
  query GiftCardsQuery {
    giftCards {
      giftCardId
      amount
    }
  }
`
export const GiftCardCodeQuery = gql`
  query GiftCardCodeQuery($giftCardId: Int!) {
    giftCardCode(giftCardId: $giftCardId) {
      code
      expiryDate
      pollingUrl
    }
  }
`

const formatNumber = (numb) => numb.toLocaleString('de-DE')

interface PropTypes {
  shouldPoll: boolean
}

function Barcode({ shouldPoll }: PropTypes) {
  const [current, send] = useMachine(barcodeMachine, {
    devTools: true,
  })
  const { data, stopPolling } = useQuery(GiftCardsQuery, {
    pollInterval: shouldPoll ? 2000 : 0,
    onCompleted: (data) => {
      if (shouldPoll && data?.giftCards.length > 0) {
        stopPolling()
      }
    },
  })
  const [getGiftCardCode] = useLazyQuery(GiftCardCodeQuery, {
    fetchPolicy: 'network-only',
    onCompleted: ({ giftCardCode: { code, expiryDate, pollingUrl } }) => {
      send({
        type: 'SUCCESS',
        code,
        expiryDate,
        pollingUrl,
      })
    },
    onError: () => {
      send('ERROR')
    },
  })
  const giftCards = data?.giftCards ?? []
  const isLoading = current.matches('loading')
  const isInvalid = current.matches('invalid')
  const getBarcode = (giftCard) => {
    getGiftCardCode({
      variables: { giftCardId: giftCard.giftCardId },
    })
    send({
      type: 'GET_BARCODE',
      giftCard,
    })
  }
  if (current.matches('idle')) {
    return (
      <Stack space={3}>
        {giftCards.map((giftCard) => (
          <Box
            key={giftCard.giftCardId}
            padding={2}
            border="standard"
            borderRadius="standard"
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Typography variant="h4">
              {formatNumber(giftCard.amount)} kr.
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                getBarcode(giftCard)
              }}
              icon="arrowRight"
            >
              Búa til strikamerki
            </Button>
          </Box>
        ))}
        <Typography variant="h4" color="blue400">
          Samtals:{' '}
          {formatNumber(giftCards.reduce((acc, { amount }) => acc + amount, 0))}{' '}
          kr.
        </Typography>
      </Stack>
    )
  }

  if (current.matches('error')) {
    return (
      <Stack space={3}>
        <ErrorPanel
          title="Villa kom upp"
          message="Eitthvað hefur farið úrskeiðis við að sækja strikamerkið þitt, vinsamlegast reyndu aftur."
        />
        <Box marginTop={4}>
          <Button
            onClick={() => {
              send('BACK_TO_LIST')
            }}
            variant="text"
            leftIcon="arrowLeft"
          >
            Aftur í lista
          </Button>
        </Box>
      </Stack>
    )
  }

  return (
    <Columns reverse collapseBelow="md">
      <Column>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="full"
          marginBottom={3}
        >
          <Typography variant="tag" color="dark400">
            Strikamerki rennur út eftir
          </Typography>
          <Typography variant="h1" color={isInvalid ? 'red400' : 'dark400'}>
            {isLoading ? (
              <SL width={114} />
            ) : (
              <Countdown
                counter={current.context.elapsed}
                countFromSeconds={current.context.secondsToExpiry}
              />
            )}{' '}
            mín
          </Typography>
          {isInvalid && (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box marginRight={2}>
                <Icon type="alert" color="red400" width={19} />
              </Box>
              <Typography variant="tag" color="red400">
                Strikamerki útrunnið
              </Typography>
            </Box>
          )}
        </Box>
      </Column>
      <Column>
        <Box textAlign="center">
          <Box position="relative" marginBottom={2}>
            {isLoading ? (
              <SL height={250} />
            ) : (
              <RenderBarcode
                code={current.context.barcode as string}
                invalid={isInvalid}
              />
            )}
            {isInvalid && (
              <Box
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  onClick={() => {
                    getBarcode(current.context.giftCard)
                  }}
                >
                  Fá nýtt strikamerki
                </Button>
              </Box>
            )}
          </Box>
          <Stack space={1}>
            <Typography variant="h3">Virði</Typography>
            <Typography variant="h1">
              {formatNumber(current.context.giftCard.amount)} kr.
            </Typography>
          </Stack>
        </Box>

        <Box marginTop={4}>
          <Button
            onClick={() => {
              send('BACK_TO_LIST')
            }}
            variant="text"
            leftIcon="arrowLeft"
          >
            Aftur í lista
          </Button>
        </Box>
      </Column>
    </Columns>
  )
}

export default Barcode
