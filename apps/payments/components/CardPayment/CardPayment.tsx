import { useFormContext, Controller } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { card, cardValidationError } from '../../messages'
import { useState } from 'react'
import { validateCardCVC, validateCardExpiry } from './CardPayment.utils'

interface CardPaymentInput {
  card: string
  cardExpiry: string
  cardCVC: string
}

const CARD_MASK_BY_TYPE = {
  default: '9999 9999 9999 9999',
  amex: '9999 999999 99999',
}

const getCardType = (cardNumber: string) => {
  if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) {
    return 'amex'
  }
  return 'default'
}

export const CardPayment = () => {
  const { control, formState } = useFormContext<CardPaymentInput>()
  const { formatMessage } = useLocale()
  const [cardMask, setCardMask] = useState(CARD_MASK_BY_TYPE['default'])

  const handleCardChange = (cardNumber: string) => {
    const cardType = getCardType(cardNumber)

    setCardMask(CARD_MASK_BY_TYPE[cardType] ?? CARD_MASK_BY_TYPE.default)
  }

  return (
    <>
      <PaymentContainer>
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
              maskPlaceholder={null}
              {...field}
              onChange={(e) => {
                const cardNumber = e.target.value.replace(/\s/g, '')
                handleCardChange(cardNumber)
                field.onChange(cardNumber)
              }}
            >
              <Input
                name={field.name}
                backgroundColor="blue"
                label={formatMessage(card.cardNumber)}
                placeholder={formatMessage(card.cardNumberPlaceholder)}
                size="sm"
                errorMessage={formState.errors.card?.message}
              />
            </InputMask>
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
                  mask="99/99"
                  maskPlaceholder={null}
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\s/g, ''))
                  }
                >
                  <Input
                    name={field.name}
                    backgroundColor="blue"
                    label={formatMessage(card.cardExpiry)}
                    placeholder={formatMessage(card.cardExpiryPlaceholder)}
                    size="sm"
                    rows={6}
                    errorMessage={formState.errors.cardExpiry?.message}
                  />
                </InputMask>
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
                <InputMask mask="999" maskPlaceholder={null} {...field}>
                  <Input
                    name={field.name}
                    backgroundColor="blue"
                    label={formatMessage(card.cardCVC)}
                    placeholder={formatMessage(card.cardCVCPlaceholder)}
                    size="sm"
                    rows={6}
                    errorMessage={formState.errors.cardCVC?.message}
                  />
                </InputMask>
              )}
            />
          </Box>
        </Box>
      </PaymentContainer>
    </>
  )
}
