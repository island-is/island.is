import { useUserInfo } from '@island.is/react-spa/bff'
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
import {
  CONTENT_GAP,
  CONTENT_GAP_LG,
  CONTENT_GAP_SM,
  SECTION_GAP,
} from '../Medicine/constants'
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
    { loading: confirmationLoading, error: confirmationError },
  ] = useGetInsuranceConfirmationLazyQuery()

  const getInsuranceConfirmation = async () => {
    const { data: fetchedData } = await getInsuranceConfirmationLazyQuery()
    const downloadData = fetchedData?.rightsPortalInsuranceConfirmation

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
      <Box marginBottom={CONTENT_GAP_LG}>
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
          space={CONTENT_GAP}
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
        <Stack space={SECTION_GAP}>
          <GridRow
            marginBottom={[
              CONTENT_GAP_SM,
              CONTENT_GAP_SM,
              CONTENT_GAP_SM,
              CONTENT_GAP_LG,
            ]}
          >
            <GridColumn span="12/12">
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="flexStart"
                printHidden
              >
                <Box
                  paddingRight={CONTENT_GAP}
                  marginBottom={[
                    CONTENT_GAP_SM,
                    CONTENT_GAP_SM,
                    CONTENT_GAP_SM,
                    0,
                  ]}
                >
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
          <StackWithBottomDivider space={CONTENT_GAP_SM}>
            <UserInfoLine
              title={formatMessage(messages.statusOfRights)}
              label={formatMessage(messages.healthInsuranceStart)}
              content={
                insurance.from
                  ? formatMessage(formatDateFns(insurance.from, 'dd.MM.yyyy'))
                  : ''
              }
            />
            <UserInfoLine
              label={formatMessage(messages.status)}
              content={insurance.status?.display ?? undefined}
            />
          </StackWithBottomDivider>
          <StackWithBottomDivider space={CONTENT_GAP_SM}>
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
            <StackWithBottomDivider space={CONTENT_GAP_SM}>
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
