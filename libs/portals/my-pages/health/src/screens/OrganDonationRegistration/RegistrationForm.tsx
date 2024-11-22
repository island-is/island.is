import {
  Box,
  RadioButton,
  Stack,
  Text,
  Button,
  toast,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  LinkResolver,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { messages } from '../..'
import { useEffect, useState } from 'react'
import React from 'react'
import { HealthPaths } from '../../lib/paths'
import * as styles from './OrganDonationRegistration.css'
import Limitations from './Limitations'
import { useNavigate } from 'react-router-dom'
import {
  useGetOrgansListQuery,
  useUpdateOrganDonationInfoMutation,
} from '../OrganDonation/OrganDonation.generated'
import { Loader } from './Loader'

const OPT_IN = 'opt-in'
const OPT_IN_EXCEPTIONS = 'opt-in-exceptions'
const OPT_OUT = 'opt-out'

export const Form2 = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const { data, loading } = useGetOrgansListQuery({
    variables: { locale: lang },
    fetchPolicy: 'no-cache',
  })

  const isDonor = data?.healthDirectorateOrganDonation.donor?.isDonor
  const hasLimitations =
    data?.healthDirectorateOrganDonation.donor?.limitations?.hasLimitations
  const allLimitations = data?.healthDirectorateOrganDonation.organList
  const selectedLimitations =
    data?.healthDirectorateOrganDonation.donor?.limitations?.limitedOrgansList?.map(
      (item) => item.id,
    )
  const donorStatus = isDonor
    ? hasLimitations
      ? OPT_IN_EXCEPTIONS
      : OPT_IN
    : OPT_OUT
  const [radioValue, setRadioValue] = useState<string | undefined>(donorStatus)

  const [updateDonorStatus, { loading: submitLoading }] =
    useUpdateOrganDonationInfoMutation({
      onCompleted: () => {
        toast.success(formatMessage(messages.registrationComplete))
        navigate(HealthPaths.HealthOrganDonation, { replace: true })
      },
      onError: () => {
        toast.error(formatMessage(messages.registrationFailed))
      },
    })

  useEffect(() => {
    if (radioValue !== donorStatus) {
      setRadioValue(donorStatus)
    }
  }, [donorStatus])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const idKey = 'selected-limitations-'
    const limitations = Object.keys(data)
      .filter((key) => key.includes(idKey))
      .map((key) => key.replace(idKey, '').toLowerCase())

    await updateDonorStatus({
      variables: {
        input: {
          isDonor: radioValue === OPT_IN || radioValue === OPT_IN_EXCEPTIONS,
          organLimitations: radioValue === OPT_IN_EXCEPTIONS ? limitations : [],
        },
        locale: lang,
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
      {loading && <Loader />}
      {!loading && (
        <form onSubmit={onSubmit}>
          <Stack space={2}>
            <Box
              background="blue100"
              borderRadius="default"
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
              borderRadius="default"
              border="standard"
              borderColor="blue200"
              padding={3}
            >
              <RadioButton
                id={`organ-donation-1`}
                name="organ-registration-value"
                label={formatMessage(
                  messages.organDonationRegistrationException,
                )}
                value={OPT_IN_EXCEPTIONS}
                checked={radioValue === OPT_IN_EXCEPTIONS}
                onChange={() => setRadioValue(OPT_IN_EXCEPTIONS)}
              />
              {allLimitations &&
                allLimitations.length > 0 &&
                radioValue === OPT_IN_EXCEPTIONS && (
                  <Limitations
                    data={allLimitations}
                    selected={selectedLimitations ?? []}
                  />
                )}
            </Box>
            <Box
              background="blue100"
              borderRadius="default"
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
              disabled={radioValue === undefined || submitLoading}
            >
              {formatMessage(coreMessages.codeConfirmation)}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}

export default Form2
