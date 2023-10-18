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
  useGetCopaymentPeriodsQuery,
  useGetCopaymentBillsLazyQuery,
  useGetCopaymentBillsQuery,
} from '../Payments.generated'

export const PaymentPartication = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(1)

  const { data, loading, error } = useGetCopaymentStatusQuery()

  const {
    data: periods,
    loading: periodsLoading,
    error: periodsError,
  } = useGetCopaymentPeriodsQuery()

  console.log('periods', periods)

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

  console.log('bills', bills)

  const { formatMessage, formatDateFns } = useLocale()

  const status = data?.rightsPortalCopaymentStatus.items[0]

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
      ) : (
        <Box>
          <Box borderBottomWidth="standard" borderColor="blueberry200">
            <Stack dividers="blueberry200" space={1}>
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                titlePadding={2}
                label={formatMessage(messages.maximumMonthlyPayment)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: status?.maximumMonthlyPayment ?? 0,
                })}
              />
              <UserInfoLine
                label={formatMessage(messages.paymentTarget)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: status?.maximumPayment ?? 0,
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
                  title="Villa kom upp"
                  message="Ekki tókst að sækja greiðsluupplýsingar"
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
                                  amount: period.maximumPayment,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.monthPayment,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.status,
                                },
                              )}
                            </T.Data>
                            <T.Data>
                              {formatMessage(
                                messages.medicinePaymentPaidAmount,
                                {
                                  amount: period.repaid,
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
                <AlertMessage type="error" title="Villa kom upp" />
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
                            amount: bill.totalAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.insuranceAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.ownAmount,
                          })}
                        </T.Data>
                        <T.Data>
                          {formatMessage(messages.medicinePaymentPaidAmount, {
                            amount: bill.overpaid,
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
                          amount: 0,
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: 0,
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: 0,
                        })}
                      </T.Data>
                      <T.Data>
                        {formatMessage(messages.medicinePaymentPaidAmount, {
                          amount: 0,
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
      )}
    </Box>
  )
}

export default PaymentPartication

{
  /*


*/
}
