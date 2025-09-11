import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { isValid as isValidKennitala } from 'kennitala'
import { useMutation, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  type Option,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { isDefined, sortAlpha } from '@island.is/shared/utils'
import type {
  ConnectedComponent,
  WebLandspitaliCatalogQuery,
  WebLandspitaliCatalogQueryVariables,
  WebLandspitaliCreateMemorialCardPaymentUrlMutation,
  WebLandspitaliCreateMemorialCardPaymentUrlMutationVariables,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import {
  CREATE_LANDSPITALI_MEMORIAL_CARD_PAYMENT_URL,
  GET_LANDSPITALI_CATALOG,
} from '@island.is/web/screens/queries/Landspitali'

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
  senderEmail: string
  senderNationalId: string
  senderAddress: string
  senderPostalCode: string
  senderPlace: string
  amountISKCustom: string
}

const DEFAULT_FUND_OPTIONS: Option<string>[] = [
  {
    label: 'Styrktarsjóður gjörgæslu',
    value: 'MR108',
  },
  {
    label: 'Styrktarsjóður lyflækninga',
    value: 'MR109',
  },
  {
    label: 'Gjafasjóður kvennadeilda LHS',
    value: 'MR117',
  },
  {
    label: 'Minningarsjóður öldrunardeildar',
    value: 'MR118',
  },
  {
    label: 'Blóð- og krabbameinslækningadeild',
    value: 'MR119',
  },
  {
    label: 'Líknardeild og heimahlynning ',
    value: 'MR120',
  },
  {
    label: 'Minningarsjóður skurðdeildar',
    value: 'MR121',
  },
  {
    label: 'Minningarsjóður hjartadeildar',
    value: 'MR122',
  },
  {
    label: 'Minningarsjóður RHLÖ',
    value: 'MR123',
  },
  {
    label: 'Minningagjafasjóður Landspítala',
    value: 'MR124',
  },
]

const PRESET_AMOUNTS = ['5.000', '10.000', '50.000', '100.000']

export const MemorialCard = ({ slice }: MemorialCardProps) => {
  const { formatMessage } = useIntl()

  const { data: catalogData } = useQuery<
    WebLandspitaliCatalogQuery,
    WebLandspitaliCatalogQueryVariables
  >(GET_LANDSPITALI_CATALOG)

  const [nationalIdSkipped, setNationalIdSkipped] = useState(false)

  const fundOptions = useMemo(() => {
    const options = (
      (slice.json?.fundOptions as typeof DEFAULT_FUND_OPTIONS) ??
      DEFAULT_FUND_OPTIONS
    ).filter((option) => {
      const contains = catalogData?.webLandspitaliCatalog?.item?.some(
        (item) => item.chargeItemCode === option.value,
      )
      if (!isDefined(contains)) return true
      return contains
    })

    if (slice.configJson?.sortFundOptionsAlphabetically) {
      options.sort(sortAlpha('label'))
    }

    return options
  }, [
    catalogData?.webLandspitaliCatalog?.item,
    slice.configJson?.sortFundOptionsAlphabetically,
    slice.json?.fundOptions,
  ])

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
      senderEmail: '',
      senderNationalId: '',
      senderAddress: '',
      senderPostalCode: '',
      senderPlace: '',
      amountISKCustom: '',
    },
  })

  const [loading, setLoading] = useState(false)
  const hasScrolledToOverview = useRef(false)

  const [createMemorialCardPaymentUrl] = useMutation<
    WebLandspitaliCreateMemorialCardPaymentUrlMutation,
    WebLandspitaliCreateMemorialCardPaymentUrlMutationVariables
  >(CREATE_LANDSPITALI_MEMORIAL_CARD_PAYMENT_URL)

  const [
    errorOccuredWhenCreatingPaymentUrl,
    setErrorOccuredWhenCreatingPaymentUrl,
  ] = useState(false)

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
      if (!hasScrolledToOverview.current) {
        overviewTitleRef.current?.scrollIntoView({ behavior: 'smooth' })
        hasScrolledToOverview.current = true
      }
    } else {
      hasScrolledToOverview.current = false
    }
  }, [submitted])

  const formatCurrency = (amount: string | number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleReset = () => setSubmitted(false)

  const { activeLocale } = useI18n()

  if (submitted) {
    const data = methods.getValues()
    const amountISK =
      data.amountISK === 'other' ? data.amountISKCustom : data.amountISK
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
            {formatMessage(m.overview.amountISK)} {amountISK}{' '}
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
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          columnGap={2}
        >
          <Button onClick={handleReset} variant="ghost" preTextIcon="arrowBack">
            {formatMessage(m.overview.goBack)}
          </Button>
          <Button
            loading={loading}
            onClick={async () => {
              const amountISKWithoutDots = amountISK.replace(/\./g, '')
              try {
                setLoading(true)
                const response = await createMemorialCardPaymentUrl({
                  variables: {
                    input: {
                      amountISK: parseInt(amountISKWithoutDots),
                      fundChargeItemCode: data.fund,
                      payerAddress: data.senderAddress,
                      payerName: data.senderName,
                      payerEmail: data.senderEmail,
                      payerNationalId: data.senderNationalId,
                      payerPostalCode: data.senderPostalCode,
                      payerPlace: data.senderPlace,
                      recipientAddress: data.recipientAddress,
                      recipientName: data.recipientName,
                      recipientPlace: data.recipientPlace,
                      recipientPostalCode: data.recipientPostalCode,
                      senderSignature: data.senderSignature,
                      locale: activeLocale,
                      inMemoryOf: data.inMemoryOf,
                    },
                  },
                })
                const url =
                  response.data?.webLandspitaliMemorialCardPaymentUrl.url
                setErrorOccuredWhenCreatingPaymentUrl(!url)
                if (url) {
                  window.location.href = url
                } else {
                  setLoading(false)
                }
              } catch {
                setLoading(false)
                setErrorOccuredWhenCreatingPaymentUrl(true)
              }
            }}
          >
            {formatMessage(m.overview.pay)}
          </Button>
        </Box>
        {errorOccuredWhenCreatingPaymentUrl && (
          <AlertMessage
            title={formatMessage(m.overview.errorTitle)}
            message={formatMessage(m.overview.errorMessage)}
            type="error"
          />
        )}
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
            defaultValue={
              fundOptions.find((opt) => opt.value === watch('fund'))?.value
            }
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
              maxLength={14}
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
              id="senderEmail"
              type="email"
              label={formatMessage(m.info.senderEmailLabel)}
              size="xs"
              error={errors.senderEmail?.message}
              rules={requiredRule}
              control={control}
            />

            <Stack space={1}>
              <InputController
                id="senderNationalId"
                label={formatMessage(m.info.senderNationalIdLabel)}
                size="xs"
                error={
                  nationalIdSkipped
                    ? undefined
                    : errors.senderNationalId?.message
                }
                type="text"
                inputMode="numeric"
                format="######-####"
                disabled={nationalIdSkipped}
                rules={{
                  validate: (value) => {
                    if (nationalIdSkipped) {
                      return true
                    }
                    if (!isValidKennitala(value)) {
                      return formatMessage(m.validation.invalidNationalIdFormat)
                    }
                    return true
                  },
                }}
                control={control}
              />
              <Checkbox
                id="senderNationalIdSkipped"
                label={formatMessage(m.info.senderNationalIdSkippedLabel)}
                checked={nationalIdSkipped}
                onChange={() => {
                  const newValue = !nationalIdSkipped
                  setNationalIdSkipped(newValue)
                  if (newValue) {
                    setValue('senderNationalId', '')
                  }
                }}
                labelVariant="small"
              />
            </Stack>

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
