import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetInsuranceConfirmationLazyQuery,
  useGetInsuranceOverviewQuery,
} from './HealthOverview.generated'
import {
  ErrorScreen,
  IntroHeader,
  UserInfoLine,
  amountFormat,
  m,
  downloadLink,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/auth/react'
import { CONTENT_GAP, SECTION_GAP } from '../Medicine/constants'
import { HealthPaths } from '../../lib/paths'
import { Link } from 'react-router-dom'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const user = useUserInfo()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  const [
    getInsuranceConfirmationLazyQuery,
    { loading: confirmationLoading, error: confirmationError },
  ] = useGetInsuranceConfirmationLazyQuery()

  const featureFlagClient = useFeatureFlagClient()

  const [enabledPaymentPage, setEnabledPaymentPage] = useState<boolean>(false)

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalHealthPaymentPageEnabled`,
        false,
      )
      if (ffEnabled) {
        setEnabledPaymentPage(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const insurance = data?.rightsPortalInsuranceOverview.items[0]
  const errors = data?.rightsPortalInsuranceOverview.errors

  async function getInsuranceConfirmation() {
    const data = await getInsuranceConfirmationLazyQuery()
    const downloadData = data.data?.rightsPortalInsuranceConfirmation.items[0]

    if (downloadData?.data && downloadData.fileName) {
      downloadLink(downloadData.data, 'application/pdf', downloadData.fileName)
    }
  }

  if (error) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.overview).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          title={formatMessage(user.profile.name)}
          intro={formatMessage(messages.overviewIntro)}
          serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
          serviceProviderTooltip={formatMessage(messages.healthTooltip)}
        />
      </Box>
      {loading ? (
        <SkeletonLoader
          repeat={3}
          space={2}
          height={24}
          borderRadius="standard"
        />
      ) : !insurance || !insurance.isInsured ? (
        <AlertMessage
          type="info"
          title={formatMessage(messages.noHealthInsurance)}
          message={insurance?.explanation}
        />
      ) : (
        <Box>
          {!!errors?.length && (
            <Box marginBottom={CONTENT_GAP}>
              <Stack space={2}>
                {errors?.map((error, i) => (
                  <AlertMessage
                    // We can switch on error.status to show different messages, but for now there is only one error message
                    key={i}
                    type="warning"
                    title={formatMessage(
                      messages.healthInternalServiceErrorTitle,
                    )}
                    message={formatMessage(
                      messages.healthInternalServiceErrorInfo,
                    )}
                  />
                ))}
              </Stack>
            </Box>
          )}
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blue200"
          >
            <Stack space={1} dividers="blueberry200">
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                label={formatMessage(messages.healthInsuranceStart)}
                content={formatMessage(
                  formatDateFns(insurance.from, 'dd.MM.yyyy'),
                )}
              />
              <UserInfoLine
                label={formatMessage(messages.status)}
                content={insurance.status?.display ?? undefined}
              />
              <UserInfoLine
                label={formatMessage(messages.healthInsuranceConfirmation)}
                content={
                  confirmationError ? (
                    formatMessage(
                      messages.healthInsuranceConfirmationTransferError,
                    )
                  ) : (
                    <Button
                      icon="fileTrayFull"
                      iconType="outline"
                      size="small"
                      type="button"
                      variant="text"
                      as="button"
                      onClick={getInsuranceConfirmation}
                      disabled={confirmationLoading}
                    >
                      {confirmationLoading
                        ? formatMessage(
                            messages.healthInsuranceConfirmationLoading,
                          )
                        : formatMessage(
                            messages.healthInsuranceConfirmationButton,
                          )}
                    </Button>
                  )
                }
              />
            </Stack>
          </Box>
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blue200"
          >
            <Stack space={1} dividers="blueberry200">
              <UserInfoLine
                title={formatMessage(messages.paymentParticipation)}
                label={formatMessage(messages.paymentTarget)}
                editLink={{
                  title: formatMessage(messages.seeMore),
                  url: HealthPaths.HealthPaymentOverview,
                  external: true,
                }}
                content={amountFormat(insurance.maximumPayment ?? 0)}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HealthOverview
