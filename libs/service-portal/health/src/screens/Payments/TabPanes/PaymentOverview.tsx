import {
  AlertMessage,
  Box,
  DatePicker,
  SkeletonLoader,
  Stack,
  Text,
  Table as T,
  Button,
} from '@island.is/island-ui/core'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { SECTION_GAP } from '../../Medicine/constants'
import * as styles from './Payments.css'
import {
  useGetPaymentOverviewQuery,
  useGetPaymentOverviewServiceTypesQuery,
} from '../Payments.generated'
import { useIntl } from 'react-intl'
import sub from 'date-fns/sub'

export const PaymentOverview = () => {
  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { months: 1 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())

  const { data, loading, error } = useGetPaymentOverviewServiceTypesQuery()

  const status = data?.rightsPortalPaymentOverviewServiceTypes.items[0]

  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
  } = useGetPaymentOverviewQuery({
    variables: {
      input: {
        dateFrom: startDate?.toString(),
        dateTo: endDate?.toString(),
        serviceTypeCode: '',
      },
    },
  })

  const overview = overviewData?.rightsPortalPaymentOverview.items[0]

  const intl = useIntl()
  const { formatMessage, formatDateFns } = useLocale()

  return (
    <Box paddingY={4} background="white">
      {error ? (
        <AlertMessage
          type="error"
          title="Villa kom upp"
          message="Ekki tókst að sækja greiðsluupplýsingar"
        />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : status ? (
        <Box>
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blueberry200"
          >
            <Stack dividers="blueberry200" space={1}>
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                titlePadding={2}
                label={formatMessage(messages.credit)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: overview?.credit
                    ? intl.formatNumber(overview.credit)
                    : overview?.credit,
                })}
              />
              <UserInfoLine
                label={formatMessage(messages.debit)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: overview?.debt
                    ? intl.formatNumber(overview.debt)
                    : overview?.debt,
                })}
              />
            </Stack>
          </Box>

          <Box>
            <Text marginBottom={2} variant="h5">
              {formatMessage(messages.invoices)}
            </Text>
            <Box
              marginBottom={SECTION_GAP}
              display="flex"
              justifyContent="flexStart"
              columnGap={2}
            >
              <DatePicker
                size="xs"
                label={formatMessage(m.dateFrom)}
                placeholderText={formatMessage(m.chooseDate)}
                handleChange={(date) => setStartDate(date)}
                selected={startDate}
              />
              <DatePicker
                size="xs"
                label={formatMessage(m.dateTo)}
                placeholderText={formatMessage(m.chooseDate)}
                handleChange={(date) => setEndDate(date)}
                selected={endDate}
              />
            </Box>
            <Box marginBottom={SECTION_GAP}>
              {overviewError ? (
                <AlertMessage
                  type="error"
                  title="Villa kom upp"
                  message="Ekki tókst að sækja greiðsluupplýsingar"
                />
              ) : overviewLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : (
                <T.Table>
                  <T.Head>
                    <tr className={styles.tableRowStyle}>
                      <T.HeadData>{formatMessage(m.date)}</T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.typeofService)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.totalPayment)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.insuranceShare)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.paymentDocument)}
                      </T.HeadData>
                    </tr>
                  </T.Head>
                  <T.Body>
                    {overview?.bills?.map((item, index) => (
                      <tr key={index} className={styles.tableRowStyle}>
                        <T.Data>
                          {formatDateFns(item.date, 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data>{item.serviceType?.name}</T.Data>
                        <T.Data>{item.totalAmount}</T.Data>
                        <T.Data>{item.insuranceAmount}</T.Data>
                        <T.Data>
                          <Button
                            iconType="outline"
                            onClick={() => undefined} // TODO: Add download functionality
                            variant="text"
                            icon="open"
                            size="small"
                          >
                            Sækja skjal
                          </Button>
                        </T.Data>
                      </tr>
                    ))}
                  </T.Body>
                </T.Table>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <AlertMessage
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFound)}
          type="warning"
        />
      )}
    </Box>
  )
}

export default PaymentOverview
