import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { isValid as isValidKennitala } from 'kennitala'
import { useMutation } from '@apollo/client'

import {
  AlertMessage,
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
import type {
  ConnectedComponent,
  CreateDirectGrantPaymentUrlMutation,
  CreateDirectGrantPaymentUrlMutationVariables,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { CREATE_LANDSPITALI_DIRECT_GRANT_PAYMENT_URL } from '@island.is/web/screens/queries/Landspitali'

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

const DEFAULT_GRANT_OPTIONS = [
  {
    label: 'Styrktarsjóður barna- og unglingageðdeildar',
    value: 'MR106',
  },
  {
    label: 'Styrktarsjóður Barnaspítala Hringsins',
    value: 'MR105',
  },
  {
    label: 'Styrktarsjóður Blóðbankans',
    value: 'MR133',
  },
  {
    label: 'Styrktarsjóður bráðasviðs',
    value: 'MR104',
  },
  {
    label: 'Styrktarsjóður endurhæfingar',
    value: 'MR112',
  },
  {
    label: 'Styrktarsjóður geðsviðs',
    value: 'MR103',
  },
  {
    label: 'Styrktarsjóður gjörgæslu',
    value: 'MR110',
  },
  {
    label: 'Styrktarsjóður hjartadeildar',
    value: 'MR130',
  },
  {
    label: 'Styrktarsjóður kvenna- og fæðingardeildar',
    value: 'MR125',
  },
  {
    label: 'Styrktarsjóður Landspítala',
    value: 'MR101',
  },
  {
    label: 'Styrktarsjóður lyflækningadeilda',
    value: 'MR111',
  },
  {
    label: 'Styrktarsjóður myndgreininga',
    value: 'MR115',
  },
  {
    label: 'Styrktarsjóður rannsóknarstofa',
    value: 'MR114',
  },
  {
    label: 'Styrktarsjóður skurðlækningadeildar',
    value: 'MR107',
  },
  {
    label: 'Styrktarsjóður öldrunar',
    value: 'MR113',
  },
]

const PRESET_AMOUNTS = ['5.000', '10.000', '50.000', '100.000']

const PRESET_PROJECTS = ['Endurmennt', 'Ótilgreint', 'Rannsóknir', 'Tækjakaup']

export const DirectGrants = ({ slice }: DirectGrantsProps) => {
  const { formatMessage } = useIntl()
  const grantOptions = slice.json?.grantOptions ?? DEFAULT_GRANT_OPTIONS

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
    CreateDirectGrantPaymentUrlMutation,
    CreateDirectGrantPaymentUrlMutationVariables
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
      console.log('data', data)

      const response = await createDirectGrantPaymentUrl({
        variables: {
          input: {
            grant: data.grant,
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
            defaultValue={grantOptions.find(
              (opt: { value: string }) => opt.value === watch('grant'),
            )}
            onSelect={(opt) => setValue('grant', (opt?.value as string) || '')}
            error={errors.grant?.message}
            rules={requiredRule}
          />
          <Text variant="h2">{formatMessage(m.info.projectTitle)}</Text>
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={2}>
            {PRESET_PROJECTS.map((project) => (
              <RadioButton
                key={project}
                id={`project-${project}`}
                name="project"
                label={project}
                checked={selectedProject === project}
                onChange={() =>
                  setValue('project', project, { shouldValidate: true })
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
                  message: formatMessage(m.validation.invalidNationalIdLength),
                },
                validate: (value) => {
                  if (value.length !== 10) {
                    return formatMessage(m.validation.invalidNationalIdLength)
                  }
                  if (!isValidKennitala(value)) {
                    return formatMessage(m.validation.invalidNationalIdFormat)
                  }
                  return true
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
            <InputController
              id="senderGrantExplanation"
              label={formatMessage(m.info.senderGrantExplanation)}
              size="xs"
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
            <Button loading={loading} type="submit">
              {formatMessage(m.info.pay)}
            </Button>
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
