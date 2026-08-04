import { useFormContext, Controller } from 'react-hook-form'
import { format, InputMask } from '@react-input/mask'

import { Box, Input, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { card, cardValidationError } from '../../messages'
import { useEffect, useState } from 'react'
import { validateCardCVC, validateCardExpiry } from './CardPayment.utils'

const APPLE_PAY_BUTTON_ID = 'apple-pay-button'

interface CardPaymentInput {
  cardholderName: string
  card: string
  cardExpiry: string
  cardCVC: string
}

const MASK_REPLACEMENT = { _: /\d/ }

// The form stores unmasked digits; the inputs display the masked value.
const toMaskedValue = (value: string | undefined, mask: string) =>
  format((value ?? '').replace(/\D/g, ''), {
    mask,
    replacement: MASK_REPLACEMENT,
  })

const CARD_MASK_BY_TYPE = {
  default: '____ ____ ____ ____',
  amex: '____ ______ _____',
}

const getCardType = (cardNumber: string) => {
  if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) {
    return 'amex'
  }
  return 'default'
}

export const CardPayment = ({
  supportsApplePay,
  initiateApplePay,
}: {
  supportsApplePay: boolean
  initiateApplePay: () => void
}) => {
  const { control, formState } = useFormContext<CardPaymentInput>()
  const { formatMessage } = useLocale()
  const [cardMask, setCardMask] = useState(CARD_MASK_BY_TYPE['default'])

  // add event listener to apple pay button if available
  useEffect(() => {
    if (supportsApplePay) {
      const applePayButton = document.getElementById(APPLE_PAY_BUTTON_ID)
      if (applePayButton) {
        applePayButton.addEventListener('click', initiateApplePay)

        // Cleanup function to remove event listener
        return () => {
          applePayButton.removeEventListener('click', initiateApplePay)
        }
      }
    }
  }, [supportsApplePay, initiateApplePay])

  const handleCardChange = (cardNumber: string) => {
    const cardType = getCardType(cardNumber)

    setCardMask(CARD_MASK_BY_TYPE[cardType] ?? CARD_MASK_BY_TYPE.default)
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={[2]}>
      {supportsApplePay && (
        <>
          <Box display="flex" flexDirection="row" flexGrow={1}>
            <apple-pay-button
              id={APPLE_PAY_BUTTON_ID}
              buttonstyle="black"
              type="plain"
              locale="is-IS" // apple does not support is-IS so this defaults to en-US
            ></apple-pay-button>
          </Box>
          <Box display="flex" alignItems="center" wrap="nowrap" columnGap={2}>
            <Box flexGrow={1}>
              <Divider />
            </Box>
            <Text variant="small">{formatMessage(card.cardOptionLabel)}</Text>
            <Box flexGrow={1}>
              <Divider />
            </Box>
          </Box>
        </>
      )}
      <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
        <Controller
          name={'cardholderName'}
          control={control}
          rules={{
            required: formatMessage(cardValidationError.cardholderName),
            validate: (value) => {
              if (value.trim().length < 2) {
                return formatMessage(cardValidationError.cardholderNameTooShort)
              }
              return true
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              backgroundColor="blue"
              label={formatMessage(card.cardholderName)}
              placeholder={formatMessage(card.cardholderNamePlaceholder)}
              size="sm"
              maxLength={45}
              errorMessage={formState.errors.cardholderName?.message}
            />
          )}
        />
        <Controller
          name={'card'}
          control={control}
          rules={{
            required: formatMessage(cardValidationError.cardNumber),
            validate: (value) => {
              if (value.length < 15) {
                return formatMessage(cardValidationError.cardNumberTooShort)
              }
              return true
            },
          }}
          render={({ field }) => (
            <InputMask
              mask={cardMask}
              replacement={MASK_REPLACEMENT}
              component={Input}
              {...field}
              value={toMaskedValue(field.value, cardMask)}
              onChange={(e) => {
                const cardNumber = e.target.value.replace(/\s/g, '')
                handleCardChange(cardNumber)
                field.onChange(cardNumber)
              }}
              backgroundColor="blue"
              label={formatMessage(card.cardNumber)}
              placeholder={formatMessage(card.cardNumberPlaceholder)}
              size="sm"
              errorMessage={formState.errors.card?.message}
            />
          )}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          columnGap={[2, 3]}
        >
          <Box width="full">
            <Controller
              name={'cardExpiry'}
              control={control}
              rules={{
                required: formatMessage(cardValidationError.cardExpiry),
                validate: (value) => validateCardExpiry(value, formatMessage),
              }}
              render={({ field }) => (
                <InputMask
                  mask="__/__"
                  replacement={MASK_REPLACEMENT}
                  component={Input}
                  {...field}
                  value={toMaskedValue(field.value, '__/__')}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\s/g, ''))
                  }
                  backgroundColor="blue"
                  label={formatMessage(card.cardExpiry)}
                  placeholder={formatMessage(card.cardExpiryPlaceholder)}
                  size="sm"
                  errorMessage={formState.errors.cardExpiry?.message}
                />
              )}
            />
          </Box>
          <Box width="full">
            <Controller
              name={'cardCVC'}
              control={control}
              rules={{
                required: formatMessage(cardValidationError.cardCVC),
                validate: (value) => validateCardCVC(value, formatMessage),
              }}
              render={({ field }) => (
                <InputMask
                  mask="___"
                  replacement={MASK_REPLACEMENT}
                  component={Input}
                  {...field}
                  value={toMaskedValue(field.value, '___')}
                  backgroundColor="blue"
                  label={formatMessage(card.cardCVC)}
                  placeholder={formatMessage(card.cardCVCPlaceholder)}
                  size="sm"
                  errorMessage={formState.errors.cardCVC?.message}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
