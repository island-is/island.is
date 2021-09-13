import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useMachine } from '@xstate/react'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import * as Yup from 'yup'

import {
  Box,
  Stack,
  Typography,
  ButtonDeprecated as Button,
  IconDeprecated as Icon,
  Columns,
  Column,
  SkeletonLoader as SL,
  Divider,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import {
  ErrorPanel,
  FieldInput,
  FieldNumberInput,
} from '@island.is/gjafakort-web/components'

import { barcodeMachine } from './barcodeMachine'
import { Countdown, RenderBarcode } from '..'
import { Form, Formik, Field } from 'formik'
import { NotificationService } from '@island.is/gjafakort-web/services'

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

function Barcode({ shouldPoll: initialPolling }: PropTypes) {
  const [initialPollingActive, setInitialPollingActive] = useState(true)
  const shouldPoll = initialPollingActive && initialPolling

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
          setInitialPollingActive(false)
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
  const [giveGift] = useMutation(GiveGiftMutation)
  const [current, send] = useMachine(barcodeMachine, {
    devTools: true,
    actions: {
      refetchList: refetch,
    },
  })

  const confirmGiveGift = async (
    giftCardId,
    recipientMobileNumber,
    message,
  ) => {
    const {
      data: { giveGift: giveGiftResponse },
    } = await giveGift({
      variables: { input: { giftCardId, recipientMobileNumber, message } },
    })
    if (giveGiftResponse.success) {
      NotificationService.success({
        title: t.successToastTitle,
        text: t.successToastText + recipientMobileNumber,
      })
    } else {
      NotificationService.error({
        title: t.errorToastTitle,
        text: t.errorToastText,
      })
    }
    send('BACK_TO_LIST')
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
                {giftCard.giftDetail && (
                  <Typography variant="p">
                    {t.fromPrefix} {giftCard.giftDetail.from}
                  </Typography>
                )}
              </Box>
              <Button
                noWrap
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
          phoneNumber: current.context.giveInfo.phoneNumber,
          message: current.context.giveInfo.message,
        }}
        onSubmit={(values) => {
          send({
            type: 'CONFIRM_GIVE',
            giveInfo: values,
          })
        }}
      >
        {() => (
          <Form>
            <Stack space={3}>
              <Typography variant="h4">
                {t.giveGiftCard}{' '}
                <Typography color="blue400" as="span">
                  {current.context.giftCard.amount &&
                    formatNumber(current.context.giftCard.amount)}{' '}
                  kr.
                </Typography>
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
                <Box marginRight={1} flexGrow={1}>
                  <Button
                    width="fixed"
                    onClick={() => {
                      send('BACK_TO_LIST')
                    }}
                    variant="ghost"
                  >
                    {t.backButton}
                  </Button>
                </Box>
                <Box marginLeft={1} flexGrow={1} textAlign="right">
                  <Button width="fixed" htmlType="submit">
                    {t.giveContinueButton}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    )
  }

  if (current.matches('confirmGive')) {
    return (
      <Stack space={3}>
        <Box
          background="blue100"
          paddingX={5}
          paddingY={5}
          borderRadius="standard"
        >
          <Box marginBottom={4}>
            <Typography variant="h2">{t.confirmGift}</Typography>
          </Box>
          <Stack space={3}>
            <Typography variant="h3">{t.giftOverview}</Typography>
            <div>
              <Typography variant="eyebrow">{t.giveGiftCard}</Typography>
              <Typography variant="p">
                {current.context.giftCard.amount &&
                  formatNumber(current.context.giftCard.amount)}{' '}
                kr.
              </Typography>
            </div>
            <div>
              <Typography variant="eyebrow">{t.receiver}</Typography>
              <Typography variant="p">
                +354{' '}
                {current.context.giveInfo.phoneNumber
                  .toString()
                  .replace(/(\d{3})/, '$1 ')}
              </Typography>
            </div>
            {current.context.giveInfo.message && (
              <div>
                <Typography variant="eyebrow">{t.message}</Typography>
                <Typography variant="p">
                  {current.context.giveInfo.message}
                </Typography>
              </div>
            )}
          </Stack>
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <Box marginRight={1} flexGrow={1}>
            <Button
              width="fixed"
              onClick={() => {
                send('BACK_TO_GIVE')
              }}
              variant="ghost"
            >
              {t.editButton}
            </Button>
          </Box>
          <Box marginLeft={1} flexGrow={1} textAlign="right">
            <Button
              width="fixed"
              htmlType="submit"
              onClick={() => {
                confirmGiveGift(
                  current.context.giftCard.giftCardId,
                  current.context.giveInfo.phoneNumber,
                  current.context.giveInfo.message,
                )
              }}
            >
              {t.giveSubmitButton}
            </Button>
          </Box>
        </Box>
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
                    {(invalidState ||
                      (successState &&
                        parseInt(current.context.pollingData.amount) > 0)) && (
                      <Button
                        onClick={() => {
                          getBarcode(current.context.giftCard)
                        }}
                      >
                        {t.new}
                      </Button>
                    )}
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
