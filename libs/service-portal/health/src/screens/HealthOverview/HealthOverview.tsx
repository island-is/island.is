import { useUserInfo } from '@island.is/auth/react'
import {
  AlertMessage,
  Box,
  Text,
  Button,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  toast,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  StackWithBottomDivider,
  UserInfoLine,
  amountFormat,
  downloadLink,
  formatDate,
  isDateAfterToday,
  m,
} from '@island.is/service-portal/core'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { SECTION_GAP } from '../Medicine/constants'
import {
  useGetInsuranceConfirmationLazyQuery,
  useGetInsuranceOverviewQuery,
} from './HealthOverview.generated'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const user = useUserInfo()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  const [displayConfirmationErrorAlert, setDisplayConfirmationErrorAlert] =
    useState(false)

  const [
    getInsuranceConfirmationLazyQuery,
    {
      data: confirmationData,
      loading: confirmationLoading,
      error: confirmationError,
    },
  ] = useGetInsuranceConfirmationLazyQuery()

  const getInsuranceConfirmation = async () => {
    await getInsuranceConfirmationLazyQuery()
    const downloadData = confirmationData?.rightsPortalInsuranceConfirmation

    if (downloadData?.data && downloadData.fileName) {
      downloadLink(downloadData.data, 'application/pdf', downloadData.fileName)
    }
  }

  useEffect(() => {
    if (confirmationError) {
      setDisplayConfirmationErrorAlert(true)
    }
  }, [confirmationError])

  useEffect(() => {
    if (!loading && displayConfirmationErrorAlert) {
      toast.warning(
        formatMessage(messages.healthInsuranceConfirmationTransferError),
      )
      setTimeout(() => setDisplayConfirmationErrorAlert(false), 5000)
    }
  }, [displayConfirmationErrorAlert, loading, formatMessage])

  const insurance = data?.rightsPortalInsuranceOverview

  const isEhicValid = isDateAfterToday(
    data?.rightsPortalInsuranceOverview?.ehicCardExpiryDate ?? undefined,
  )

  return (
    <Box>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          title={formatMessage(user.profile.name)}
          intro={formatMessage(messages.overviewIntro)}
          serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
          serviceProviderTooltip={formatMessage(messages.healthTooltip)}
        />
        <GridRow marginBottom={[1, 1, 1, 3]}>
          <GridColumn span="12/12">
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="flexStart"
              printHidden
            >
              <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
                <Button
                  variant="utility"
                  disabled={displayConfirmationErrorAlert}
                  size="small"
                  icon="fileTrayFull"
                  loading={confirmationLoading}
                  iconType="outline"
                  onClick={() => getInsuranceConfirmation()}
                >
                  {formatMessage(messages.healthInsuranceConfirmation)}
                </Button>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
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
        <Stack space={5}>
          <StackWithBottomDivider space={1}>
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
          </StackWithBottomDivider>
          <StackWithBottomDivider space={1}>
            <UserInfoLine
              title={formatMessage(messages.paymentParticipation)}
              label={formatMessage(messages.paymentTarget)}
              editLink={{
                title: formatMessage(messages.seeMore),
                url: HealthPaths.HealthPaymentOverview,
                external: true,
                icon: 'link',
              }}
              content={amountFormat(insurance.maximumPayment ?? 0)}
            />
          </StackWithBottomDivider>
          {insurance.ehicCardExpiryDate && (
            <StackWithBottomDivider space={1}>
              <UserInfoLine
                title={formatMessage(messages.ehic)}
                label={formatMessage(messages.validityPeriod)}
                content={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="p1"
                  >
                    <Text>
                      {formatDate(insurance?.ehicCardExpiryDate, 'dd.MM.yyyy')}
                    </Text>
                    <Icon
                      icon={isEhicValid ? 'checkmarkCircle' : 'closeCircle'}
                      color={isEhicValid ? 'mint600' : 'red600'}
                      type="filled"
                    />
                    <Text fontWeight="semiBold" variant="small">
                      {formatMessage(isEhicValid ? m.valid : m.expired)}
                    </Text>
                  </Box>
                }
              />
            </StackWithBottomDivider>
          )}
        </Stack>
      )}
    </Box>
  )
}

export default HealthOverview
