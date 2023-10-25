import {
  AlertMessage,
  Box,
  DatePicker,
  SkeletonLoader,
  Stack,
  Text,
  Table as T,
} from '@island.is/island-ui/core'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { CONTENT_GAP, SECTION_GAP } from '../../Medicine/constants'
import * as styles from './Payments.css'
import {
  useGetCopaymentStatusQuery,
  useGetCopaymentBillsQuery,
  useGetCopaymentPeriodsQuery,
} from '../Payments.generated'
import { useIntl } from 'react-intl'
import sub from 'date-fns/sub'
export const PaymentPartication = () => {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(sub(new Date(), { years: 5 }))
  const intl = useIntl()
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(1)

  const { data, loading, error } = useGetCopaymentStatusQuery()

  const {
    data: periods,
    loading: periodsLoading,
    error: periodsError,
  } = useGetCopaymentPeriodsQuery({
    variables: {
      input: {
        dateFrom: startDate.toString(),
        dateTo: endDate.toString(),
      },
    },
  })

  const {
    data: bills,
    loading: billsLoading,
    error: billsError,
  } = useGetCopaymentBillsQuery({
    variables: {
      input: {
        periodId: selectedPeriodId,
      },
    },
  })

  const { formatMessage, formatDateFns } = useLocale()

  const status = data?.rightsPortalCopaymentStatus.items[0]

  return (
    <Box paddingY={4} background="white">
      {error ? (
        <AlertMessage
          type="error"
          title={formatMessage(m.errorTitle)}
          message={formatMessage(m.errorFetch)}
        />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : status ? (
        <Box>
          <Box borderBottomWidth="standard" borderColor="blueberry200">
            <Stack dividers="blueberry200" space={1}>
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                titlePadding={2}
                label={formatMessage(messages.maximumMonthlyPayment)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: status?.maximumMonthlyPayment
                    ? intl.formatNumber(status?.maximumMonthlyPayment)
                    : status?.maximumMonthlyPayment,
                })}
              />
              <UserInfoLine
                label={formatMessage(messages.paymentTarget)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: status?.maximumPayment
                    ? intl.formatNumber(status?.maximumPayment)
                    : status?.maximumPayment,
                })}
              />
            </Stack>
          </Box>
          <Box marginBottom={SECTION_GAP}>
            <Text variant="small" marginTop={5} marginBottom={2}>
              <span style={{ fontStyle: 'italic' }}>
                {formatMessage(messages.paymentParticationExplination)}
              </span>
            </Text>
          </Box>
          <Box>
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
              {periodsError ? (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.errorTitle)}
                  message={formatMessage(m.errorFetch)}
                />
              ) : periodsLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : (
                <T.Table>
                  <T.Head>
                    <tr className={styles.tableRowStyle}>
                      <T.HeadData>
                        {formatMessage(messages.statusOfRights)}
                      </T.HeadData>
                      <T.HeadData>{formatMessage(messages.month)}</T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.paymentTarget)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.monthlyPaymentShort)}
                      </T.HeadData>
                      <T.HeadData>{formatMessage(messages.right)}</T.HeadData>
                      <T.HeadData>{formatMessage(messages.repaid)}</T.HeadData>
                    </tr>
                  </T.Head>
                  <T.Body>
                    {periods?.rightsPortalCopaymentPeriods?.items.map(
                      (period) => {
                        return (
                          <tr className={styles.tableRowStyle} key={period.id}>
                            <T.Data>{period.status}</T.Data>
                            <T.Data>{period.month}</T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.maximumPayment
                                    ? intl.formatNumber(period.maximumPayment)
                                    : period.maximumPayment,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.monthPayment
                                    ? intl.formatNumber(period.monthPayment)
                                    : period.monthPayment,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.overpaid
                                    ? intl.formatNumber(period.overpaid)
                                    : period.overpaid,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.repaid
                                    ? intl.formatNumber(period.repaid)
                                    : period.repaid,
                                },
                              )}
                            </T.Data>
                          </tr>
                        )
                      },
                    )}
                  </T.Body>
                </T.Table>
              )}
            </Box>
            <Box>
              <Text marginBottom={CONTENT_GAP} variant="h5">
                {formatMessage(messages.monthlyBreakdownOfInvoices)}
              </Text>
              {billsError ? (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.errorTitle)}
                  message={formatMessage(m.errorFetch)}
                />
              ) : billsLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : (
                <T.Table>
                  <T.Head>
                    <tr className={styles.tableRowStyle}>
                      <T.HeadData>{formatMessage(m.service)}</T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.dateOfOnvoiceShort)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.totalPrice)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.medicinePaidByInsuranceShort)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.yourPayment)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.overpayment)}
                      </T.HeadData>
                    </tr>
                  </T.Head>
                  <T.Body>
                    {bills?.rightsPortalCopaymentBills.items.map((bill) => (
                      <tr className={styles.tableRowStyle} key={bill.id}>
                        <T.Data>{bill.serviceType}</T.Data>
                        <T.Data>
                          {formatDateFns(bill.date, 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.totalAmount
                              ? intl.formatNumber(bill.totalAmount)
                              : bill.totalAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.insuranceAmount
                              ? intl.formatNumber(bill.insuranceAmount)
                              : bill.insuranceAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.ownAmount
                              ? intl.formatNumber(bill.ownAmount)
                              : bill.ownAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.overpaid
                              ? intl.formatNumber(bill.overpaid)
                              : bill.overpaid,
                          })}
                        </T.Data>
                      </tr>
                    ))}
                  </T.Body>
                  <T.Foot>
                    <T.Row>
                      <T.Data>
                        <span className={styles.tableFootCell}>
                          {formatMessage(m.total)}
                        </span>
                      </T.Data>
                      <T.Data></T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: intl.formatNumber(0),
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: intl.formatNumber(0),
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: intl.formatNumber(0),
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: intl.formatNumber(0),
                        })}
                      </T.Data>
                    </T.Row>
                  </T.Foot>
                </T.Table>
              )}
            </Box>
            <Box>
              <Text variant="small" marginTop={5} marginBottom={2}>
                <span style={{ fontStyle: 'italic' }}>
                  {formatMessage(messages.paymentParticationExplination)}
                </span>
              </Text>
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

export default PaymentPartication
