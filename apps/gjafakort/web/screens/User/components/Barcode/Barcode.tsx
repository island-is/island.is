import React from 'react'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useMachine } from '@xstate/react'
import { format } from 'date-fns'
import { is } from 'date-fns/locale'
import * as Yup from 'yup'

import {
  Box,
  Stack,
  Typography,
  Button,
  Icon,
  Columns,
  Column,
  SkeletonLoader as SL,
  Divider,
  FieldNumberInput,
  FieldInput,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { ErrorPanel } from '@island.is/gjafakort-web/components'

import { barcodeMachine } from './barcodeMachine'
import { Countdown, RenderBarcode } from '..'
import { Form, Formik, Field } from 'formik'

const GiftCardsQuery = gql`
  query GiftCardsQuery {
    giftCards {
      giftCardId
      amount
      giftDetail {
        packageId
        from
        personalMessage
        greeting {
          greetingType
          text
          contentUrl
        }
      }
    }
  }
`
const GiftCardCodeQuery = gql`
  query GiftCardCodeQuery($giftCardId: Int!) {
    giftCardCode(giftCardId: $giftCardId) {
      code
      expiryDate
      pollingUrl
    }
  }
`

const GiveGiftMutation = gql`
  mutation GiveGiftMutation($input: GiveGiftInput!) {
    giveGift(input: $input) {
      success
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
      validation,
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
  const [giveGift, { data: giveGiftData }] = useMutation(GiveGiftMutation)
  const [current, send] = useMachine(barcodeMachine, {
    devTools: true,
    actions: {
      refetchList: refetch,
    },
  })

  const onSubmit = async (giftCardId, recipientMobileNumber, message) => {
    await giveGift({
      variables: { input: { giftCardId, recipientMobileNumber, message } },
    })
  }

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
      <Stack space={5}>
        {loadingInitialGiftCards && <SL height={70} />}
        {!loadingInitialGiftCards &&
          !loadingGiftCards &&
          giftCards.length <= 0 && (
            <Typography variant="h3">{t.noGiftCards}</Typography>
          )}
        {giftCards.map((giftCard) => (
          <Box key={giftCard.giftCardId}>
            <Box
              padding={2}
              marginBottom={2}
              border="standard"
              borderRadius="standard"
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              background="blue100"
            >
              <Box>
                <Typography variant="h3">
                  {formatNumber(giftCard.amount)} kr.
                </Typography>
                <Typography variant="p">
                  {t.fromPrefix} {giftCard.giftDetail.from}
                </Typography>
              </Box>
              <Button
                onClick={() => {
                  getBarcode(giftCard)
                }}
              >
                {t.createButton}
              </Button>
            </Box>
            <Button
              variant="text"
              icon="arrowRight"
              onClick={() => {
                send({
                  type: 'GIVE_GIFT_CARD',
                  giftCard,
                })
              }}
            >
              {t.giveButton}
            </Button>
          </Box>
        ))}
        <Stack space={2}>
          <Divider />
          {giftCards.length > 0 && (
            <Typography variant="h3" color="blue400">
              {t.total}:{' '}
              {formatNumber(
                giftCards.reduce((acc, { amount }) => acc + amount, 0),
              )}{' '}
              kr.
            </Typography>
          )}
        </Stack>
      </Stack>
    )
  }

  if (current.matches('give')) {
    return (
      <Formik
        validationSchema={Yup.object().shape({
          phoneNumber: Yup.string()
            .length(7, validation.phoneNumber)
            .required(validation.required),
        })}
        initialValues={{
          phoneNumber: '',
          message: '',
        }}
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        {() => (
          <Form>
            <Stack space={3}>
              <Typography variant="h4">
                {t.giveGiftCard}{' '}
                {current.context.giftCard.amount &&
                  formatNumber(current.context.giftCard.amount)}{' '}
                kr.
              </Typography>
              <Field
                component={FieldNumberInput}
                label={t.phoneNumberInput}
                name="phoneNumber"
                format="+354 ### ####"
                allowEmptyFormatting
              />
              <Field
                component={FieldInput}
                label={t.messageInput}
                name="message"
              />
              <Box display="flex" justifyContent="spaceBetween">
                <Button
                  onClick={() => {
                    send('BACK_TO_LIST')
                  }}
                  variant="ghost"
                >
                  {t.backButton}
                </Button>
                <Button htmlType="submit">{t.giveContinueButton}</Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
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
    <div>
      {current.context.expiryDate && (
        <Box
          marginBottom={4}
          background="blue100"
          borderRadius="standard"
          display="flex"
          alignItems="center"
          padding={3}
        >
          <Icon type="alert" color="blue400" />
          <Box marginLeft={1} marginRight={2}>
            <Typography variant="p">
              <strong>{t.expires.attention}</strong>
            </Typography>
          </Box>
          <Typography variant="p">
            {t.expires.disclaimer}{' '}
            {format(
              new Date(current.context.expiryDate),
              "dd. MMMM 'kl.' k:mm",
              {
                locale: is,
              },
            )}
          </Typography>
        </Box>
      )}
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
    </div>
  )
}

export default Barcode
