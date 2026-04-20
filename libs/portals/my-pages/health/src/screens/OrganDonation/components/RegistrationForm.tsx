import {
  Box,
  Button,
  RadioButton,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  LinkResolver,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../../lib/messages'
import { HealthPaths } from '../../../lib/paths'
import * as styles from '../OrganDonation.css'
import {
  useGetDonorStatusQuery,
  useUpdateOrganDonationInfoMutation,
} from '../OrganDonation.generated'
import Limitations from './Limitations'
import { Loader } from './Loader'
import { NoAccess } from './NoAccess'

const OPT_IN = 'opt-in'
const OPT_IN_EXCEPTIONS = 'opt-in-exceptions'
const OPT_OUT = 'opt-out'

export const OrganRegistrationForm = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const { data, loading } = useGetDonorStatusQuery({
    variables: { locale: lang },
    fetchPolicy: 'no-cache',
  })

  const isDonor = data?.healthDirectorateOrganDonation.donor?.isDonor
  const isMinor = data?.healthDirectorateOrganDonation.donor?.isMinor
  const isTemporaryResident =
    data?.healthDirectorateOrganDonation.donor?.isTemporaryResident
  const hasLimitations =
    data?.healthDirectorateOrganDonation.donor?.limitations?.hasLimitations
  const allLimitations = data?.healthDirectorateOrganDonation.organList
  const exceptionComment =
    data?.healthDirectorateOrganDonation.donor?.limitations?.comment

  const selectedLimitations =
    data?.healthDirectorateOrganDonation.donor?.limitations?.limitedOrgansList?.map(
      (item) => item.id,
    )

  const updatedLimitations = selectedLimitations
    ? [...selectedLimitations, ...(exceptionComment?.length ? ['other'] : [])]
    : []
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorStatus])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const idKey = 'selected-limitations-'
    const otherLimitations = data['otherLimitatons']?.toString()
    const limitations = Object.keys(data)
      .filter((key) => key.includes(idKey))
      .map((key) => key.replace(idKey, '').toLowerCase())

    await updateDonorStatus({
      variables: {
        input: {
          isDonor: radioValue === OPT_IN || radioValue === OPT_IN_EXCEPTIONS,
          organLimitations: radioValue === OPT_IN_EXCEPTIONS ? limitations : [],
          comment: otherLimitations,
        },
        locale: lang,
      },
    })
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.organDonation)}
      intro={formatMessage(messages.organDonationDescription)}
    >
      <Text variant="eyebrow" color="purple400" marginBottom={1}>
        {formatMessage(messages.changeTake)}
      </Text>
      {loading && <Loader />}
      {!loading && (isMinor || isTemporaryResident) && (
        <NoAccess
          text={
            isMinor
              ? formatMessage(messages.organMinor)
              : formatMessage(messages.organTemporaryNationalId)
          }
        />
      )}
      {!loading && !isMinor && !isTemporaryResident && (
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
                    selected={updatedLimitations ?? []}
                    exceptionComment={exceptionComment ?? undefined}
                  />
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
              disabled={radioValue === undefined || submitLoading}
            >
              {formatMessage(coreMessages.codeConfirmation)}
            </Button>
          </Box>
        </form>
      )}
    </IntroWrapper>
  )
}

export default OrganRegistrationForm
