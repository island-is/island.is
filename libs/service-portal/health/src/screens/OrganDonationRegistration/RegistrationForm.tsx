import {
  Box,
  RadioButton,
  Stack,
  Text,
  Button,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  LinkResolver,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { messages } from '../..'
import { useEffect, useState } from 'react'
import React from 'react'
import { HealthPaths } from '../../lib/paths'
import * as styles from './OrganDonationRegistration.css'
import Limitations from './Limitations'
import { useNavigate } from 'react-router-dom'
import {
  useGetDonorStatusQuery,
  useGetOrganDonationExceptionsQuery,
  useUpdateOrganDonationInfoMutation,
} from '../OrganDonation/OrganDonation.generated'

export const Form2 = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const OPT_IN = 'opt-in'
  const OPT_IN_EXCEPTIONS = 'opt-in-exceptions'
  const OPT_OUT = 'opt-out'

  const { data, loading } = useGetOrganDonationExceptionsQuery({
    variables: { locale: lang },
  })

  const [updateDonorStatus] = useUpdateOrganDonationInfoMutation({
    onCompleted: () => {
      toast.success(formatMessage(messages.registrationComplete))
      navigate(HealthPaths.HealthOrganDonation, { replace: true })
    },
    onError: () => {
      toast.error(formatMessage(messages.registrationFailed))
    },
  })
  const { data: status } = useGetDonorStatusQuery()

  const exceptions = data?.getDonationExceptions.values
  const [radioValue, setRadioValue] = useState<string | undefined>()

  useEffect(() => {
    if (radioValue === undefined) {
      setRadioValue(
        status?.getDonorStatus.isDonor
          ? OPT_IN
          : (status?.getDonorStatus?.exceptionComment?.length ?? 0) > 0
          ? OPT_IN_EXCEPTIONS
          : OPT_OUT,
      )
    }
  }, [status])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const idKey = 'organ-donation-limitation-'
    const limitations = Object.keys(data)
      .filter((key) => key.includes(idKey))
      .map((key) => key.replace(idKey, '').toLowerCase())
    await updateDonorStatus({
      variables: {
        input: {
          isDonor: radioValue === OPT_IN || radioValue === OPT_IN_EXCEPTIONS,
          exceptions: radioValue === OPT_IN_EXCEPTIONS ? limitations : [],
        },
      },
    })
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.organDonation)}
        intro={formatMessage(messages.organDonationDescription)}
      />
      <Text variant="eyebrow" color="purple400" marginBottom={1}>
        {formatMessage(messages.changeTake)}
      </Text>

      <form onSubmit={onSubmit}>
        <Stack space={2}>
          <Box
            background="blue100"
            borderRadius="large"
            border="standard"
            borderColor="blue200"
            padding={3}
          >
            <RadioButton
              id={`organ-donation-0`}
              name="organ-registration-value"
              label={formatMessage(messages.organDonationRegistrationOptIn)}
              value={OPT_IN}
              checked={radioValue === OPT_IN}
              onChange={() => setRadioValue(OPT_IN)}
            />
          </Box>
          <Box
            background="blue100"
            borderRadius="large"
            border="standard"
            borderColor="blue200"
            padding={3}
          >
            <RadioButton
              id={`organ-donation-1`}
              name="organ-registration-value"
              label={formatMessage(messages.organDonationRegistrationException)}
              value={OPT_IN_EXCEPTIONS}
              checked={radioValue === OPT_IN_EXCEPTIONS}
              onChange={() => setRadioValue(OPT_IN_EXCEPTIONS)}
            />
            {exceptions &&
              exceptions.length > 0 &&
              radioValue === OPT_IN_EXCEPTIONS && (
                <Limitations data={exceptions} />
              )}
          </Box>
          <Box
            background="blue100"
            borderRadius="large"
            border="standard"
            borderColor="blue200"
            padding={3}
          >
            <RadioButton
              id={`organ-donation-2`}
              name="organ-registration-value"
              label={formatMessage(messages.organDonationRegistrationOptOut)}
              value={OPT_OUT}
              checked={radioValue === OPT_OUT}
              onChange={() => setRadioValue(OPT_OUT)}
            />
          </Box>
        </Stack>
        <Box
          display="flex"
          justifyContent="flexEnd"
          marginTop={3}
          className={styles.buttonContainer}
        >
          <LinkResolver href={HealthPaths.HealthOrganDonation}>
            <Button size="small" variant="ghost">
              {formatMessage(coreMessages.buttonCancel)}
            </Button>
          </LinkResolver>
          <Button
            size="small"
            type="submit"
            loading={loading}
            disabled={radioValue === undefined}
          >
            {formatMessage(coreMessages.codeConfirmation)}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default Form2
