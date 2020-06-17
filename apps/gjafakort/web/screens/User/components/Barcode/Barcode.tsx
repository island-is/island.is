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

import { useI18n } from '@island.is/gjafakort-web/i18n'
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
  const {
    t: {
      user: { barcode: t },
    },
  } = useI18n()
  const { data, stopPolling, refetch, loading: loadingGiftCards } = useQuery(
    GiftCardsQuery,
    {
      pollInterval: shouldPoll ? 2000 : 0,
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (shouldPoll && data?.giftCards.length > 0) {
          stopPolling()
        }
      },
    },
  )
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
  const [current, send] = useMachine(barcodeMachine, {
    devTools: true,
    actions: {
      refetchList: () => {
        console.log('refetching')
        refetch()
      },
    },
  })
  const giftCards = data?.giftCards ?? []
  const loadingInitialGiftCards = shouldPoll && giftCards.length === 0
  const loadingState = current.matches('loading')
  const invalidState = current.matches('invalid')
  const successState = current.matches('success')
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
        {loadingInitialGiftCards && <SL height={70} />}
        {loadingGiftCards && giftCards.length <= 0 && <SL height={70} />}
        {!loadingInitialGiftCards &&
          !loadingGiftCards &&
          giftCards.length <= 0 && (
            <Typography variant="h3">{t.noGiftCards}</Typography>
          )}
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
              {t.create}
            </Button>
          </Box>
        ))}
        {giftCards.length > 0 && (
          <Typography variant="h4" color="blue400">
            {t.total}:{' '}
            {formatNumber(
              giftCards.reduce((acc, { amount }) => acc + amount, 0),
            )}{' '}
            kr.
          </Typography>
        )}
      </Stack>
    )
  }

  if (current.matches('error')) {
    return (
      <Stack space={3}>
        <ErrorPanel title={t.error.title} message={t.error.message} />
        <Box marginTop={4}>
          <Button
            onClick={() => {
              send('BACK_TO_LIST')
            }}
            variant="text"
            leftIcon="arrowLeft"
          >
            {t.error.backButton}
          </Button>
        </Box>
      </Stack>
    )
  }

  return (
    <Columns reverse collapseBelow="md">
      <Column width="6/12">
        {!successState && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="full"
            marginBottom={3}
          >
            <Typography variant="tag" color="dark400">
              {t.expires.pre}
            </Typography>
            <Typography
              variant="h1"
              color={invalidState ? 'red400' : 'dark400'}
            >
              {loadingState ? (
                <SL width={114} />
              ) : (
                <Countdown
                  counter={current.context.elapsed}
                  countFromSeconds={current.context.secondsToExpiry}
                />
              )}{' '}
              {t.expires.post}
            </Typography>
            {invalidState && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box marginRight={2}>
                  <Icon type="alert" color="red400" width={19} />
                </Box>
                <Typography variant="tag" color="red400">
                  {t.expired}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Column>
      <Column width="6/12">
        <Box textAlign="center">
          <Box position="relative" marginBottom={2}>
            {loadingState ? (
              <SL height={250} />
            ) : (
              <RenderBarcode
                code={current.context.barcode as string}
                invalid={invalidState || successState}
              />
            )}
            {(invalidState || successState) && (
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
                <Stack space={3}>
                  {successState && (
                    <>
                      <Icon
                        type="check"
                        width="49"
                        height="37"
                        color="dark400"
                      />
                      <Typography variant="h1">
                        {formatNumber(
                          current.context.giftCard.amount -
                            parseInt(current.context.pollingData.amount),
                        )}{' '}
                        kr.
                      </Typography>
                    </>
                  )}
                  <Button
                    onClick={() => {
                      getBarcode(current.context.giftCard)
                    }}
                  >
                    {t.new}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
          {successState ? (
            <Stack space={1}>
              <Typography variant="h3">{t.currentAmount}</Typography>
              <Typography variant="h1">
                {formatNumber(current.context.pollingData.amount)} kr.
              </Typography>
              <Typography variant="p">
                {t.initialAmount}
                <br />
                {formatNumber(current.context.giftCard.amount)} kr.
              </Typography>
            </Stack>
          ) : (
            <Stack space={1}>
              <Typography variant="h3">{t.value}</Typography>
              <Typography variant="h1">
                {formatNumber(current.context.giftCard.amount)} kr.
              </Typography>
            </Stack>
          )}
        </Box>

        <Box marginTop={4}>
          <Button
            onClick={() => {
              send('BACK_TO_LIST')
            }}
            variant="text"
            leftIcon="arrowLeft"
          >
            {t.backButton}
          </Button>
        </Box>
      </Column>
    </Columns>
  )
}

export default Barcode
