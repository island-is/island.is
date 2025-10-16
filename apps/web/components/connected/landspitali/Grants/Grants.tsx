import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { isValid as isValidKennitala } from 'kennitala'
import { useMutation, useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
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
  WebLandspitaliCreateDirectGrantPaymentUrlMutation,
  WebLandspitaliCreateDirectGrantPaymentUrlMutationVariables,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import {
  CREATE_LANDSPITALI_DIRECT_GRANT_PAYMENT_URL,
  GET_LANDSPITALI_CATALOG,
} from '@island.is/web/screens/queries/Landspitali'

import { m } from './translation.strings'

interface DirectGrantsProps {
  slice: ConnectedComponent
}

interface DirectGrants {
  grant: string
  project: string
  amountISK: string
  senderName: string
  senderEmail: string
  senderNationalId: string
  senderAddress: string
  senderPostalCode: string
  senderPlace: string
  senderGrantExplanation: string
  amountISKCustom: string
}

const DEFAULT_GRANT_OPTIONS: Option<string>[] = [
  {
    label: 'Styrktarsjóður Landspítala',
    value: 'MR102',
  },
  {
    label: 'Styrktarsjóður geðsviðs',
    value: 'MR103',
  },
  {
    label: 'Styrktarsjóður bráðasviðs',
    value: 'MR104',
  },
  {
    label: 'Styrktarsjóður barnaspítala Hringsins',
    value: 'MR105',
  },
  {
    label: 'Styrktarsjóður barna- og unglingageðdeildar',
    value: 'MR106',
  },
  {
    label: 'Styrktarsjóður gjörgæslu',
    value: 'MR110',
  },
  {
    label: 'Styrktarsjóður lyflækninga',
    value: 'MR111',
  },
  {
    label: 'Styrktarsjóður endurhæfingar',
    value: 'MR112',
  },
  {
    label: 'Styrktarsjóður öldrunar',
    value: 'MR113',
  },
  {
    label: 'Styrktarsjóður rannsóknarstofa',
    value: 'MR114',
  },
  {
    label: 'Styrktarsjóður myndgreininga',
    value: 'MR115',
  },
  {
    label: 'Styrktarsjóður vegna ristilkrabbameins',
    value: 'MR116',
  },
  {
    label: 'Gjafasjóður kvennadeilda LHS',
    value: 'MR125',
  },
  {
    label: 'Minningarsjóður öldrunardeildar',
    value: 'MR126',
  },
  {
    label: 'Blóð- og krabbameinslækningadeild',
    value: 'MR127',
  },
  {
    label: 'Líknardeild og heimahlynning ',
    value: 'MR128',
  },
  {
    label: 'Minningarsjóður skurðdeildar',
    value: 'MR129',
  },
  {
    label: 'Minningarsjóður hjartadeildar',
    value: 'MR130',
  },
  {
    label: 'Minningarsjóður RHLÖ',
    value: 'MR131',
  },
  {
    label: 'Minningargjafasjóður Landspítala',
    value: 'MR132',
  },
  {
    label: 'Styrktarsjóður Blóðbankans',
    value: 'MR133',
  },
]

const PRESET_AMOUNTS = ['5.000', '10.000', '50.000', '100.000']

export const DirectGrants = ({ slice }: DirectGrantsProps) => {
  const { formatMessage } = useIntl()

  const { data: catalogData } = useQuery<
    WebLandspitaliCatalogQuery,
    WebLandspitaliCatalogQueryVariables
  >(GET_LANDSPITALI_CATALOG)

  const grantOptions = useMemo(() => {
    const options = (
      (slice.json?.grantOptions as typeof DEFAULT_GRANT_OPTIONS) ??
      DEFAULT_GRANT_OPTIONS
    ).filter((option) => {
      const contains = catalogData?.webLandspitaliCatalog?.item?.some(
        (item) => item.chargeItemCode === option.value,
      )
      if (!isDefined(contains)) return true
      return contains
    })

    if (slice.configJson?.sortGrantOptionsAlphabetically) {
      options.sort(sortAlpha('label'))
    }

    return options
  }, [
    catalogData?.webLandspitaliCatalog?.item,
    slice.json?.grantOptions,
    slice.configJson?.sortGrantOptionsAlphabetically,
  ])

  const methods = useForm<DirectGrants>({
    mode: 'onChange',
    defaultValues: {
      grant: '',
      project: '',
      amountISK: '',
      senderName: '',
      senderEmail: '',
      senderNationalId: '',
      senderAddress: '',
      senderPostalCode: '',
      senderPlace: '',
      senderGrantExplanation: '',
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

  const selectedAmount = watch('amountISK')
  const selectedProject = watch('project')

  const { activeLocale } = useI18n()

  const [createDirectGrantPaymentUrl] = useMutation<
    WebLandspitaliCreateDirectGrantPaymentUrlMutation,
    WebLandspitaliCreateDirectGrantPaymentUrlMutationVariables
  >(CREATE_LANDSPITALI_DIRECT_GRANT_PAYMENT_URL)
  const [
    errorOccuredWhenCreatingPaymentUrl,
    setErrorOccuredWhenCreatingPaymentUrl,
  ] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    const data = methods.getValues()
    const amountISK =
      data.amountISK === 'other' ? data.amountISKCustom : data.amountISK
    try {
      setLoading(true)

      const response = await createDirectGrantPaymentUrl({
        variables: {
          input: {
            grantChargeItemCode: data.grant,
            project: data.project,
            payerAddress: data.senderAddress,
            payerGrantExplanation: data.senderGrantExplanation,
            payerName: data.senderName,
            payerEmail: data.senderEmail,
            payerNationalId: data.senderNationalId,
            payerPostalCode: data.senderPostalCode,
            payerPlace: data.senderPlace,
            amountISK: parseInt(amountISK.replace(/\./g, '')),
            locale: activeLocale,
            cancelUrl: window.location.href,
          },
        },
      })
      const url = response.data?.webLandspitaliDirectGrantPaymentUrl.url
      setErrorOccuredWhenCreatingPaymentUrl(!url)
      if (url) {
        window.location.href = url
      } else {
        setLoading(false)
      }
    } catch {
      setErrorOccuredWhenCreatingPaymentUrl(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    methods.register('amountISK', {
      required: formatMessage(m.validation.requiredAmount),
    })
    methods.register('project', {
      required: formatMessage(m.validation.requiredProject),
    })
  }, [methods, formatMessage])

  const requiredRule = {
    required: {
      value: true,
      message: formatMessage(m.validation.required),
    },
  }

  const formatCurrency = (amount: string | number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const projectOptions = useMemo(() => {
    return [
      {
        label: formatMessage(m.info.continuingEducationProject),
        value: 'Endurmenntun',
      },
      {
        label: formatMessage(m.info.researchProject),
        value: 'Rannsóknir',
      },

      {
        label: formatMessage(m.info.equipmentPurchaseProject),
        value: 'Tækjakaup',
      },
      {
        label: formatMessage(m.info.otherProjects),
        value: 'Önnur verkefni',
      },
    ]
  }, [formatMessage])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack space={4}>
          <SelectController
            id="grant"
            name="grant"
            size="xs"
            label={formatMessage(m.info.grantLabel)}
            options={grantOptions}
            defaultValue={
              grantOptions.find((opt) => opt.value === watch('grant'))?.value
            }
            onSelect={(opt) => setValue('grant', (opt?.value as string) || '')}
            error={errors.grant?.message}
            rules={requiredRule}
            required
          />
          <Text variant="h2">{formatMessage(m.info.projectTitle)}</Text>
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            {projectOptions.map((project) => (
              <RadioButton
                key={project.value}
                id={project.value}
                name={project.value}
                label={project.label}
                checked={selectedProject === project.value}
                onChange={() =>
                  setValue('project', project.value, { shouldValidate: true })
                }
                large={true}
              />
            ))}
            {errors.project && (
              <Text color="red600" variant="small">
                {errors.project.message}
              </Text>
            )}
          </Box>
          <Text variant="h2">{formatMessage(m.info.amountOfMoneyTitle)}</Text>
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            {PRESET_AMOUNTS.map((amount) => (
              <RadioButton
                key={amount}
                id={`amount-${amount}`}
                name={`amount-${amount}`}
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
              rules={{
                required: requiredRule.required,
                min: {
                  value: 1000,
                  message: formatMessage(m.validation.minimumAmount),
                },
              }}
              error={errors.amountISKCustom?.message}
              required
            />
          )}
          <Stack space={2}>
            <Text variant="h2">{formatMessage(m.info.senderTitle)}</Text>
            <InputController
              id="senderName"
              label={formatMessage(m.info.senderNameLabel)}
              size="xs"
              error={errors.senderName?.message}
              rules={requiredRule}
              control={control}
              required
            />
            <InputController
              id="senderEmail"
              type="email"
              label={formatMessage(m.info.senderEmailLabel)}
              size="xs"
              error={errors.senderEmail?.message}
              control={control}
              required
            />

            <GridContainer>
              <GridRow alignItems="center" rowGap={2}>
                <GridColumn span={['1/1', '1/1', '1/1', '1/1', '2/3']}>
                  <Stack space={1}>
                    <InputController
                      id="senderNationalId"
                      label={formatMessage(m.info.senderNationalIdLabel)}
                      size="xs"
                      error={errors.senderNationalId?.message}
                      type="text"
                      inputMode="numeric"
                      format="######-####"
                      rules={{
                        validate: (value) => {
                          if (!isValidKennitala(value)) {
                            return formatMessage(
                              m.validation.invalidNationalIdFormat,
                            )
                          }
                          return true
                        },
                      }}
                      control={control}
                    />
                  </Stack>
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '1/1', '1/3']}>
                  <Text variant="small">
                    {formatMessage(m.info.senderNationalIdDescription)}
                  </Text>
                </GridColumn>
              </GridRow>
            </GridContainer>

            <InputController
              id="senderAddress"
              label={formatMessage(m.info.senderAddressLabel)}
              size="xs"
              error={errors.senderAddress?.message}
              rules={requiredRule}
              control={control}
              required
            />
            <InputController
              id="senderPostalCode"
              label={formatMessage(m.info.senderPostalCodeLabel)}
              size="xs"
              error={errors.senderPostalCode?.message}
              rules={requiredRule}
              control={control}
              required
            />
            <InputController
              id="senderPlace"
              label={formatMessage(m.info.senderPlaceLabel)}
              size="xs"
              error={errors.senderPlace?.message}
              rules={requiredRule}
              control={control}
              required
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
            <Stack space={2}>
              <Box display="flex" justifyContent="flexEnd">
                <Button loading={loading} type="submit">
                  {formatMessage(m.info.pay)}
                </Button>
              </Box>
              {Object.keys(errors).length > 0 && (
                <Text variant="small" color="red600" fontWeight="medium">
                  {formatMessage(m.validation.genericFormErrorMessage)}
                </Text>
              )}
            </Stack>
          </Box>
          {errorOccuredWhenCreatingPaymentUrl && (
            <AlertMessage
              title={formatMessage(m.validation.errorTitle)}
              message={formatMessage(m.validation.errorMessage)}
              type="error"
            />
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}
