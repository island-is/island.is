import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  StackWithBottomDivider,
  UserInfoLine,
  formatDate,
  isDateAfterToday,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetInsuranceOverviewQuery } from './Payments.generated'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const Rights = () => {
  const { formatMessage } = useLocale()

  const {
    data: insuranceData,
    error: insuranceError,
    loading: insuranceLoading,
  } = useGetInsuranceOverviewQuery()

  if (insuranceError) {
    return (
      <PaymentsWrapper pathname={HealthPaths.HealthPaymentParticipation}>
        <Problem noBorder={false} error={insuranceError} />
      </PaymentsWrapper>
    )
  }
  const insurance = insuranceData?.rightsPortalInsuranceOverview

  const isEhicValid = isDateAfterToday(
    insuranceData?.rightsPortalInsuranceOverview?.ehicCardExpiryDate ??
      undefined,
  )

  return (
    <PaymentsWrapper pathname={HealthPaths.HealthPaymentRights}>
      <StackWithBottomDivider space={2}>
        <UserInfoLine
          title={formatMessage(messages.statusOfRights)}
          label={formatMessage(messages.healthInsuranceStart)}
          loading={insuranceLoading}
          content={
            insurance?.from
              ? formatMessage(formatDate(insurance?.from, 'dd.MM.yyyy'))
              : ''
          }
        />
        <UserInfoLine
          loading={insuranceLoading}
          label={formatMessage(messages.status)}
          content={insurance?.status?.display ?? undefined}
        />

        <UserInfoLine
          label={formatMessage(messages.ehic)}
          loading={insuranceLoading}
          editLink={
            !isEhicValid
              ? {
                  url: formatMessage(messages.renewEhicUrl),
                  external: true,
                  title: formatMessage(messages.validForRenewal),
                }
              : undefined
          }
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
    </PaymentsWrapper>
  )
}

export default Rights
