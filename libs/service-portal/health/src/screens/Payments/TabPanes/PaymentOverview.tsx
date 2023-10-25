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

import { useIntl } from 'react-intl'
import { useGetPaymentOverviewQuery } from '../Payments.generated'
import sub from 'date-fns/sub'

export const PaymentOverview = () => {
  const intl = useIntl()
  const { formatMessage, formatDateFns } = useLocale()
  const [dateFrom, setDateFrom] = useState<Date>(sub(new Date(), { years: 5 }))
  const [dateTo, setDateTo] = useState<Date>(new Date())

  const { data, loading, error } = useGetPaymentOverviewQuery({
    variables: {
      input: {
        dateFrom: formatDateFns(dateFrom.toString(), 'yyyy-MM-dd'),
        dateTo: formatDateFns(dateTo.toString(), 'yyyy-MM-dd'),
      },
    },
  })

  const overview = data?.rightsPortalPaymentOverview.items[0]

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
      ) : overview ? (
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
                  amount: overview?.debit
                    ? intl.formatNumber(overview.debit)
                    : overview?.debit,
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
                handleChange={(date) => setDateFrom(date)}
                selected={dateFrom}
              />
              <DatePicker
                size="xs"
                label={formatMessage(m.dateTo)}
                placeholderText={formatMessage(m.chooseDate)}
                handleChange={(date) => setDateTo(date)}
                selected={dateTo}
              />
            </Box>
            <Box marginBottom={SECTION_GAP}>
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
                  {overview.bills?.map((item, index) => (
                    <tr key={index} className={styles.tableRowStyle}>
                      <T.Data>{formatDateFns(item.date, 'dd.MM.yyyy')}</T.Data>
                      <T.Data>{item.serviceType}</T.Data>
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
