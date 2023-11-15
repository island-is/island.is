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
import {
  UserInfoLine,
  amountFormat,
  m,
  numberFormat,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { CONTENT_GAP, SECTION_GAP } from '../Medicine/constants'
import * as styles from './Payments.css'
import {
  useGetCopaymentStatusQuery,
  useGetCopaymentPeriodsQuery,
  useGetCopaymentBillsQuery,
} from './Payments.generated'
import sub from 'date-fns/sub'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const PaymentPartication = () => {
  const { formatMessage, formatDateFns } = useLocale()

  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { years: 1 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null)
  const [hoverPeriodId, setHoverPeriodId] = useState<number | null>(null)

  const { data, loading, error } = useGetCopaymentStatusQuery()

  const {
    data: periods,
    loading: periodsLoading,
    error: periodsError,
  } = useGetCopaymentPeriodsQuery({
    variables: {
      input: {
        dateTo: formatDateFns(endDate.toString(), 'MM.dd.yyyy'),
        dateFrom: formatDateFns(startDate.toString(), 'MM.dd.yyyy'),
      },
    },
  })

  const {
    data: billsData,
    loading: billsLoading,
    error: billsError,
  } = useGetCopaymentBillsQuery({
    variables: {
      input: {
        periodId: selectedPeriodId ? selectedPeriodId : 0,
      },
    },
  })

  const status = data?.rightsPortalCopaymentStatus.items[0]
  const bills = billsData?.rightsPortalCopaymentBills.items

  return (
    <PaymentsWrapper>
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
                content={amountFormat(status?.maximumMonthlyPayment ?? 0)}
              />
              <UserInfoLine
                label={formatMessage(messages.paymentTarget)}
                content={amountFormat(status?.maximumPayment ?? 0)}
              />
            </Stack>
          </Box>
          <Box marginBottom={SECTION_GAP}>
            <Text variant="small" marginTop={5} marginBottom={2}>
              {formatMessage(messages.paymentParticationExplination, {
                basePayment: numberFormat(status.basePayment ?? 0),
              })}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box marginBottom={4}>
          <AlertMessage
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFound)}
            type="warning"
          />
        </Box>
      )}
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
          <Box>
            <Text marginBottom={CONTENT_GAP} variant="h5">
              {formatMessage(messages.period)}
            </Text>
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
            </Box>
            {!!periods?.rightsPortalCopaymentPeriods?.items.length && (
              <T.Table>
                <T.Head>
                  <tr className={styles.tableRowStyle}>
                    <T.HeadData>
                      {formatMessage(messages.statusOfRights)}
                    </T.HeadData>
                    <T.HeadData>{formatMessage(m.month)}</T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.paymentTarget)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.monthlyPaymentShort)}
                    </T.HeadData>
                    <T.HeadData>{formatMessage(messages.right)}</T.HeadData>
                    <T.HeadData>{formatMessage(messages.repaid)}</T.HeadData>
                    <T.HeadData></T.HeadData>
                  </tr>
                </T.Head>
                <T.Body>
                  {periods.rightsPortalCopaymentPeriods.items.map((period) => {
                    return (
                      <tr
                        tabIndex={0}
                        onMouseOver={() =>
                          setHoverPeriodId(period.id ? period.id : null)
                        }
                        onFocus={() =>
                          setHoverPeriodId(period.id ? period.id : null)
                        }
                        className={styles.tableRowStyle}
                        key={period.id}
                      >
                        <T.Data>{period.status?.display}</T.Data>
                        <T.Data>{period.month}</T.Data>
                        <T.Data>
                          {amountFormat(period.maximumPayment ?? 0)}
                        </T.Data>
                        <T.Data>
                          {amountFormat(period.monthPayment ?? 0)}
                        </T.Data>
                        <T.Data>{amountFormat(period.overpaid ?? 0)}</T.Data>
                        <T.Data>{amountFormat(period.repaid ?? 0)}</T.Data>
                        <T.Data>
                          <div
                            className={styles.selectButton({
                              visible: period?.id
                                ? period.id === hoverPeriodId
                                : false,
                            })}
                          >
                            <Button
                              size="small"
                              icon="pencil"
                              variant="text"
                              onClick={() =>
                                setSelectedPeriodId(
                                  period.id ? period.id : null,
                                )
                              }
                            >
                              Velja
                            </Button>
                          </div>
                        </T.Data>
                      </tr>
                    )
                  })}
                </T.Body>
              </T.Table>
            )}
          </Box>
        )}
      </Box>
      <Box>
        {billsError ? (
          <AlertMessage
            type="error"
            title={formatMessage(m.errorTitle)}
            message={formatMessage(m.errorFetch)}
          />
        ) : billsLoading ? (
          <SkeletonLoader space={2} repeat={3} height={24} />
        ) : bills?.length ? (
          <Box>
            <Text marginBottom={CONTENT_GAP} variant="h5">
              {formatMessage(messages.monthlyBreakdownOfInvoices)}
            </Text>
            <T.Table>
              <T.Head>
                <tr className={styles.tableRowStyle}>
                  <T.HeadData>{formatMessage(m.service)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.dateOfInvoiceShort)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.totalPrice)}</T.HeadData>
                  <T.HeadData>
                    {formatMessage(messages.medicinePaidByInsuranceShort)}
                  </T.HeadData>
                  <T.HeadData>{formatMessage(messages.yourPayment)}</T.HeadData>
                  <T.HeadData>{formatMessage(messages.overpayment)}</T.HeadData>
                </tr>
              </T.Head>
              <T.Body>
                {bills.map((bill) => (
                  <tr className={styles.tableRowStyle} key={bill.id}>
                    <T.Data>{bill.serviceType}</T.Data>
                    <T.Data>{formatDateFns(bill.date, 'dd.MM.yyyy')}</T.Data>
                    <T.Data>{amountFormat(bill.totalAmount ?? 0)}</T.Data>
                    <T.Data>{amountFormat(bill.insuranceAmount ?? 0)}</T.Data>
                    <T.Data>{amountFormat(bill.ownAmount ?? 0)}</T.Data>
                    <T.Data>{amountFormat(bill.overpaid ?? 0)}</T.Data>
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
                    {amountFormat(
                      bills?.reduce((a, b) => {
                        return a + (b?.totalAmount ?? 0)
                      }, 0) ?? 0,
                    )}
                  </T.Data>
                  <T.Data>
                    {amountFormat(
                      bills?.reduce((a, b) => {
                        return a + (b?.insuranceAmount ?? 0)
                      }, 0) ?? 0,
                    )}
                  </T.Data>
                  <T.Data>
                    {amountFormat(
                      bills?.reduce((a, b) => {
                        return a + (b?.ownAmount ?? 0)
                      }, 0) ?? 0,
                    )}
                  </T.Data>
                  <T.Data>
                    {amountFormat(
                      bills?.reduce((a, b) => {
                        return a + (b?.overpaid ?? 0)
                      }, 0) ?? 0,
                    )}
                  </T.Data>
                </T.Row>
              </T.Foot>
            </T.Table>
          </Box>
        ) : undefined}
      </Box>
      <Box>
        <Text variant="small" marginTop={5} marginBottom={2}>
          {formatMessage(messages.paymentParticationExplinationFooter)}
        </Text>
      </Box>
    </PaymentsWrapper>
  )
}

export default PaymentPartication
