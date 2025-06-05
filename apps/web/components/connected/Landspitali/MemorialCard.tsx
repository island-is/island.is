import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  FocusableBox,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'

import { m } from './translation.strings'

interface MemorialCardProps {
  slice: ConnectedComponent
}

interface MemorialCard {
  fund: string
  inMemoryOf: string
  amountISK: string
  senderSignature: string
  recipientName: string
  recipientAddress: string
  recipientPostalCode: string
  recipientPlace: string
  senderName: string
  senderNationalId: string
  senderAddress: string
  senderPostalCode: string
  senderPlace: string
}

const DEFAULT_FUND_OPTIONS = [
  {
    label: 'Minningargjafasjóður Landspítala Íslands',
    value: 'Minningargjafasjóður Landspítala Íslands',
  },
  {
    label: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    value: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
  },
  {
    label: 'Minningarsjóður gjörgæslu',
    value: 'Minningarsjóður gjörgæslu',
  },
  {
    label: 'Minningarsjóður hjartadeildar',
    value: 'Minningarsjóður hjartadeildar',
  },
  {
    label: 'Minningarsjóður kvenlækningadeildar',
    value: 'Minningarsjóður kvenlækningadeildar',
  },
  {
    label: 'Minningarsjóður líknardeildar og HERU',
    value: 'Minningarsjóður líknardeildar og HERU',
  },
  {
    label: 'Minningarsjóður lyflækningadeilda',
    value: 'Minningarsjóður lyflækningadeilda',
  },
  {
    label: 'Minningarsjóður Rannsóknarstofu HÍ og LSH í öldrunarfræðum',
    value: 'Minningarsjóður Rannsóknarstofu HÍ og LSH í öldrunarfræðum',
  },
  {
    label: 'Minningarsjóður skurðdeildar',
    value: 'Minningarsjóður skurðdeildar',
  },
  {
    label: 'Minningarsjóður öldrunardeildar',
    value: 'Minningarsjóður öldrunardeildar',
  },
]

const PRESET_AMOUNTS = ['5000', '10000', '50000', '100000']

export const MemorialCard = ({ slice }: MemorialCardProps) => {
  const { formatMessage } = useIntl()
  const fundOptions = slice.json?.speedLimitOptions ?? DEFAULT_FUND_OPTIONS

  const methods = useForm<MemorialCard>({
    mode: 'onChange',
    defaultValues: {
      fund: '',
      inMemoryOf: '',
      amountISK: '',
      senderSignature: '',
      recipientName: '',
      recipientAddress: '',
      recipientPostalCode: '',
      recipientPlace: '',
      senderName: '',
      senderNationalId: '',
      senderAddress: '',
      senderPostalCode: '',
      senderPlace: '',
    },
  })

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = methods

  const [submitted, setSubmitted] = useState(false)
  const selectedAmount = watch('amountISK')

  const onSubmit = (data: MemorialCard) => {
    setSubmitted(true)
    console.log('Submitted data:', data)
  }

  const handleReset = () => setSubmitted(false)

  if (submitted) {
    const data = methods.getValues()
    return (
      <Stack space={4}>
        <Text variant="h2">{formatMessage(m.overview.title)}</Text>
        <Stack space={2}>
          <Text variant="h3">{formatMessage(m.overview.senderTitle)}</Text>
          <Text>
            {formatMessage(m.overview.senderName)} {data.senderName}
          </Text>
          <Text>
            {formatMessage(m.overview.senderNationalId)} {data.senderNationalId}
          </Text>
          <Text>
            {formatMessage(m.overview.senderAddress)} {data.senderAddress}
          </Text>
          <Text>
            {formatMessage(m.overview.senderPostalCode)} {data.senderPostalCode}
          </Text>
        </Stack>
        <Stack space={2}>
          <Text variant="h3">{formatMessage(m.overview.recipientTitle)}</Text>
          <Text>
            {formatMessage(m.overview.recipientName)} {data.recipientName}
          </Text>
          <Text>
            {formatMessage(m.overview.recipientAddress)} {data.recipientAddress}
          </Text>
          <Text>
            {formatMessage(m.overview.recipientPostalCode)}{' '}
            {data.recipientPostalCode}
          </Text>
          <Text>
            {formatMessage(m.overview.inMemoryOf)} {data.inMemoryOf}
          </Text>
        </Stack>
        <Stack space={2}>
          <Text variant="h3">
            {formatMessage(m.overview.senderSignatureTitle)}
          </Text>
          <Text>
            {formatMessage(m.overview.senderSignature)} {data.senderSignature}
          </Text>
        </Stack>
        <Stack space={2}>
          <Text variant="h3">
            {formatMessage(m.overview.memorialCardTitle)}
          </Text>
          <Text>
            {formatMessage(m.overview.amountISK)} {data.amountISK} kr.
          </Text>
          <Text>
            {formatMessage(m.overview.fund)} {data.fund}
          </Text>
        </Stack>
        <Box display="flex" justifyContent="spaceBetween">
          <Button onClick={handleReset}>
            {formatMessage(m.overview.goBack)}
          </Button>
          <Button>{formatMessage(m.overview.pay)}</Button>
        </Box>
      </Stack>
    )
  }

  const requiredRule = {
    required: { value: true, message: 'Það þarf að fylla út þennan reit' },
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack space={4}>
          <SelectController
            id="fund"
            name="fund"
            label={formatMessage(m.info.fundLabel)}
            options={fundOptions}
            defaultValue={fundOptions.find(
              (opt: { value: string }) => opt.value === watch('fund'),
            )}
            onSelect={(opt) => setValue('fund', (opt?.value as string) || '')}
            error={errors.fund?.message}
            rules={requiredRule}
          />

          <InputController
            id="inMemoryOf"
            control={control}
            label={formatMessage(m.info.inMemoryOfLabel)}
            size="xs"
            error={errors.inMemoryOf?.message}
            rules={requiredRule}
          />

          <Text variant="h2">{formatMessage(m.info.amountOfMoneyTitle)}</Text>
          <Text>{formatMessage(m.info.amountOfMoneyExtraInfo)}</Text>

          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            {PRESET_AMOUNTS.map((amount) => (
              <FocusableBox
                key={amount}
                border="standard"
                borderRadius="standard"
                padding={2}
              >
                <RadioButton
                  id={`amount-${amount}`}
                  name="amountISK"
                  label={parseInt(amount)}
                  checked={selectedAmount === amount}
                  onChange={() => setValue('amountISK', amount)}
                />
              </FocusableBox>
            ))}
            <FocusableBox border="standard" borderRadius="standard" padding={2}>
              <RadioButton
                id="amount-other-radio"
                name="amountISK"
                label={formatMessage(m.info.amountOfMoneyOtherRadioLabel)}
                checked={!PRESET_AMOUNTS.includes(selectedAmount)}
                onChange={() => setValue('amountISK', '')}
              />
            </FocusableBox>
          </Box>

          {!PRESET_AMOUNTS.includes(selectedAmount) && (
            <InputController
              id="amountISK"
              control={control}
              label={formatMessage(m.info.amountOfMoneyOtherInputLabel)}
              type="number"
              inputMode="numeric"
              currency={true}
              error={
                parseInt(selectedAmount) < 1000
                  ? 'Lágmark er 1.000 kr.'
                  : undefined
              }
              rules={requiredRule}
            />
          )}

          <InputController
            id="senderSignature"
            control={control}
            label={formatMessage(m.info.senderSignatureLabel)}
            size="xs"
            error={errors.senderSignature?.message}
            rules={requiredRule}
          />

          <Stack space={2}>
            <Text variant="h2">{formatMessage(m.info.recipientLabel)}</Text>
            <InputController
              id="recipientName"
              label={formatMessage(m.info.recipientNameLabel)}
              size="xs"
              error={errors.recipientName?.message}
              rules={requiredRule}
            />
            <InputController
              id="recipientAddress"
              label={formatMessage(m.info.recipientAddressLabel)}
              size="xs"
              error={errors.recipientAddress?.message}
              rules={requiredRule}
            />
            <InputController
              id="recipientPostalCode"
              label={formatMessage(m.info.recipientPostalCodeLabel)}
              size="xs"
              error={errors.recipientPostalCode?.message}
              rules={requiredRule}
            />
            <InputController
              id="recipientPlace"
              label={formatMessage(m.info.recipientPlaceLabel)}
              size="xs"
              error={errors.recipientPlace?.message}
              rules={requiredRule}
            />
          </Stack>

          <Stack space={2}>
            <Text variant="h2">{formatMessage(m.info.senderTitle)}</Text>
            <InputController
              id="senderName"
              label={formatMessage(m.info.senderNameLabel)}
              size="xs"
              error={errors.senderName?.message}
              rules={requiredRule}
            />
            <InputController
              id="senderNationalId"
              label={formatMessage(m.info.senderNationalIdLabel)}
              size="xs"
              error={errors.senderNationalId?.message}
              type="number"
              inputMode="numeric"
              rules={requiredRule}
            />
            <InputController
              id="senderAddress"
              label={formatMessage(m.info.senderAddressLabel)}
              size="xs"
              error={errors.senderAddress?.message}
              rules={requiredRule}
            />
            <InputController
              id="senderPostalCode"
              label={formatMessage(m.info.senderPostalCodeLabel)}
              size="xs"
              error={errors.senderPostalCode?.message}
              rules={requiredRule}
            />
            <InputController
              id="senderPlace"
              label={formatMessage(m.info.senderPlaceLabel)}
              size="xs"
              error={errors.senderPlace?.message}
              rules={requiredRule}
            />
            <Text>
              {formatMessage(m.info.amountISKPrefix)} {selectedAmount || 0}{' '}
              {formatMessage(m.info.amountISKCurrency)}
            </Text>
          </Stack>

          <Box>
            <Button type="submit">{formatMessage(m.info.continue)}</Button>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  )
}
