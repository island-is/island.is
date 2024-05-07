import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetInsuranceConfirmationLazyQuery,
  useGetInsuranceOverviewQuery,
} from './HealthOverview.generated'
import {
  IntroHeader,
  UserInfoLine,
  amountFormat,
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
} from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/auth/react'
import { CONTENT_GAP, SECTION_GAP } from '../Medicine/constants'
import { HealthPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const user = useUserInfo()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  const [
    getInsuranceConfirmationLazyQuery,
    { loading: confirmationLoading, error: confirmationError },
  ] = useGetInsuranceConfirmationLazyQuery()

  const getInsuranceConfirmation = async () => {
    const data = await getInsuranceConfirmationLazyQuery()
    const downloadData = data.data?.rightsPortalInsuranceConfirmation

    if (downloadData?.data && downloadData.fileName) {
      downloadLink(downloadData.data, 'application/pdf', downloadData.fileName)
    }
  }

  const insurance = data?.rightsPortalInsuranceOverview

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
      {error ? (
        <Problem error={error} noBorder={false} />
      ) : loading ? (
        <SkeletonLoader
          repeat={3}
          space={2}
          height={24}
          borderRadius="standard"
        />
      ) : !insurance?.isInsured ? (
        <AlertMessage
          type="info"
          title={formatMessage(messages.noHealthInsurance)}
          message={insurance?.explanation}
        />
      ) : (
        <>
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
        </>
      )}
    </Box>
  )
}

export default HealthOverview
