import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
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
  amountISKCustom: string
}

const DEFAULT_FUND_OPTIONS = [
  {
    label: 'Minningargjafasjóður Landspítala Íslands',
    value: 'MR124',
  },
  {
    label: 'Minningarsjóður blóð- og krabbameinslækningadeilda',
    value: 'MR119',
  },
  {
    label: 'Minningarsjóður gjörgæslu',
    value: 'MR108',
  },
  {
    label: 'Minningarsjóður hjartadeildar',
    value: 'MR122',
  },
  {
    label: 'Minningarsjóður kvenlækningadeildar',
    value: 'MR117',
  },
  {
    label: 'Minningarsjóður líknardeildar og HERU',
    value: 'MR128',
  },
  {
    label: 'Minningarsjóður lyflækningadeilda',
    value: 'MR109',
  },
  {
    label: 'Minningarsjóður Rannsóknarstofu HÍ og LSH í öldrunarfræðum',
    value: 'MR131',
  },
  {
    label: 'Minningarsjóður skurðdeildar',
    value: 'MR121',
  },
  {
    label: 'Minningarsjóður öldrunardeildar',
    value: 'MR118',
  },
]

const PRESET_AMOUNTS = ['5.000', '10.000', '50.000', '100.000']

export const MemorialCard = ({ slice }: MemorialCardProps) => {
  const { formatMessage } = useIntl()
  const fundOptions = slice.json?.fundOptions ?? DEFAULT_FUND_OPTIONS

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
      amountISKCustom: '',
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
  const overviewTitleRef = useRef<HTMLDivElement>(null)

  const onSubmit = () => {
    setSubmitted(true)
  }

  useEffect(() => {
    methods.register('amountISK', {
      required: formatMessage(m.validation.requiredAmount),
    })
  }, [methods, formatMessage])

  useEffect(() => {
    if (submitted) {
      overviewTitleRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [submitted])

  const formatCurrency = (amount: string | number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleReset = () => setSubmitted(false)

  if (submitted) {
    const data = methods.getValues()
    return (
      <Stack space={4}>
        <Text ref={overviewTitleRef} variant="h2">
          {formatMessage(m.overview.title)}
        </Text>
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
            {formatMessage(m.overview.amountISK)}{' '}
            {data.amountISK === 'other'
              ? formatCurrency(data.amountISKCustom)
              : data.amountISK}{' '}
            {formatMessage(m.info.amountISKCurrency)}
          </Text>
          <Text>
            {formatMessage(m.overview.fund)}{' '}
            {
              fundOptions.find(
                (opt: { value: string }) => opt.value === data.fund,
              )?.label
            }
          </Text>
        </Stack>
        <Box display="flex" justifyContent="spaceBetween" marginTop={5}>
          <Button onClick={handleReset} variant="ghost" preTextIcon="arrowBack">
            {formatMessage(m.overview.goBack)}
          </Button>
          <Button>{formatMessage(m.overview.pay)}</Button>
        </Box>
      </Stack>
    )
  }

  const requiredRule = {
    required: {
      value: true,
      message: formatMessage(m.validation.required),
    },
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack space={4}>
          <SelectController
            id="fund"
            name="fund"
            size="xs"
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

          <InputController
            id="senderSignature"
            control={control}
            label={formatMessage(m.info.senderSignatureLabel)}
            size="xs"
            error={errors.senderSignature?.message}
            rules={requiredRule}
          />

          <Text variant="h2">{formatMessage(m.info.amountOfMoneyTitle)}</Text>
          <Text>{formatMessage(m.info.amountOfMoneyExtraInfo)}</Text>

          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            {PRESET_AMOUNTS.map((amount) => (
              <RadioButton
                key={amount}
                id={`amount-${amount}`}
                name="amountISK"
                label={amount}
                checked={selectedAmount === amount}
                onChange={() =>
                  setValue('amountISK', amount, { shouldValidate: true })
                }
                large={true}
              />
            ))}
            <RadioButton
              id="amount-other-radio"
              name="amountISK"
              label={formatMessage(m.info.amountOfMoneyOtherRadioLabel)}
              checked={selectedAmount === 'other'}
              onChange={() =>
                setValue('amountISK', 'other', { shouldValidate: true })
              }
              large={true}
            />

            {errors.amountISK && (
              <Text color="red600" variant="small">
                {errors.amountISK.message}
              </Text>
            )}
          </Box>

          {selectedAmount === 'other' && (
            <InputController
              id="amountISKCustom"
              control={control}
              size="xs"
              label={formatMessage(m.info.amountOfMoneyOtherInputLabel)}
              type="number"
              inputMode="numeric"
              currency={true}
              error={
                parseInt(watch('amountISKCustom') || '0') < 1000
                  ? formatMessage(m.validation.minimumAmount)
                  : undefined
              }
              rules={requiredRule}
            />
          )}

          <Stack space={2}>
            <Text variant="h2">{formatMessage(m.info.recipientLabel)}</Text>
            <InputController
              id="recipientName"
              label={formatMessage(m.info.recipientNameLabel)}
              size="xs"
              error={errors.recipientName?.message}
              rules={requiredRule}
              control={control}
            />
            <InputController
              id="recipientAddress"
              label={formatMessage(m.info.recipientAddressLabel)}
              size="xs"
              error={errors.recipientAddress?.message}
              rules={requiredRule}
              control={control}
            />
            <InputController
              id="recipientPostalCode"
              label={formatMessage(m.info.recipientPostalCodeLabel)}
              size="xs"
              error={errors.recipientPostalCode?.message}
              rules={requiredRule}
              control={control}
            />
            <InputController
              id="recipientPlace"
              label={formatMessage(m.info.recipientPlaceLabel)}
              size="xs"
              error={errors.recipientPlace?.message}
              rules={requiredRule}
              control={control}
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
              control={control}
            />
            <InputController
              id="senderNationalId"
              label={formatMessage(m.info.senderNationalIdLabel)}
              size="xs"
              error={errors.senderNationalId?.message}
              type="number"
              inputMode="numeric"
              rules={{
                ...requiredRule,
                pattern: {
                  value: /^\d{10}$/,
                  message: formatMessage(m.validation.invalidNationalId),
                },
              }}
              control={control}
            />
            <InputController
              id="senderAddress"
              label={formatMessage(m.info.senderAddressLabel)}
              size="xs"
              error={errors.senderAddress?.message}
              rules={requiredRule}
              control={control}
            />
            <InputController
              id="senderPostalCode"
              label={formatMessage(m.info.senderPostalCodeLabel)}
              size="xs"
              error={errors.senderPostalCode?.message}
              rules={requiredRule}
              control={control}
            />
            <InputController
              id="senderPlace"
              label={formatMessage(m.info.senderPlaceLabel)}
              size="xs"
              error={errors.senderPlace?.message}
              rules={requiredRule}
              control={control}
            />
          </Stack>
          <Box>
            <Text>
              {formatMessage(m.info.amountISKPrefix)}{' '}
              {selectedAmount === 'other'
                ? formatCurrency(watch('amountISKCustom') || 0)
                : selectedAmount || 0}{' '}
              {formatMessage(m.info.amountISKCurrency)}
            </Text>
            <Text>{formatMessage(m.info.amountISKExtra)}</Text>
          </Box>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button type="submit" icon="arrowForward">
              {formatMessage(m.info.continue)}
            </Button>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  )
}
