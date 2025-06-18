import {
  Box,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DownloadFileButtons,
  ExpandHeader,
  MobileTable,
  StackWithBottomDivider,
  UserInfoLine,
  amountFormat,
  formatDate,
  isDateAfterToday,
  m,
  numberFormat,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import sub from 'date-fns/sub'
import { useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP, SECTION_GAP } from '../../utils/constants'
import { exportPaymentParticipationOverview } from '../../utils/FileBreakdown'
import {
  useGetCopaymentPeriodsQuery,
  useGetCopaymentStatusQuery,
  useGetInsuranceOverviewQuery,
} from './Payments.generated'
import { PaymentTableRow } from './PaymentTableRow'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const Rights = () => {
  const { formatMessage, lang } = useLocale()

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
