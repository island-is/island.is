import {
  AlertMessage,
  Box,
  DatePicker,
  SkeletonLoader,
  Stack,
  Text,
  Table as T,
} from '@island.is/island-ui/core'
import {
  ExpandHeader,
  ExpandRow,
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
  useGetCopaymentBillsLazyQuery,
} from './Payments.generated'
import sub from 'date-fns/sub'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'
import { HealthPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

export const PaymentPartication = () => {
  const { formatMessage, formatDateFns } = useLocale()

  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { years: 1 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())

  const { data, loading, error } = useGetCopaymentStatusQuery()
  const [
    getCopaymentBillsQuery,
    { data: billsData, loading: billsLoading, error: billsError },
  ] = useGetCopaymentBillsLazyQuery()

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

  const getBills = (periodId: number) =>
    getCopaymentBillsQuery({
      variables: {
        input: {
          periodId,
        },
      },
    })

  if (error) {
    return (
      <PaymentsWrapper pathname={HealthPaths.HealthPaymentParticipation}>
        <AlertMessage
          type="error"
          title={formatMessage(m.errorTitle)}
          message={formatMessage(m.errorNoConnection)}
        />
      </PaymentsWrapper>
    )
  }

  return (
    <PaymentsWrapper pathname={HealthPaths.HealthPaymentParticipation}>
      {loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : data?.rightsPortalCopaymentStatus ? (
        <Box>
          <Box borderBottomWidth="standard" borderColor="blueberry200">
            <Stack dividers="blueberry200" space={1}>
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                titlePadding={2}
                label={formatMessage(messages.maximumMonthlyPayment)}
                content={amountFormat(
                  data.rightsPortalCopaymentStatus?.maximumMonthlyPayment ?? 0,
                )}
              />
              <UserInfoLine
                label={formatMessage(messages.paymentTarget)}
                content={amountFormat(
                  data.rightsPortalCopaymentStatus?.maximumPayment ?? 0,
                )}
              />
            </Stack>
          </Box>
          <Box marginBottom={SECTION_GAP}>
            <Text variant="small" marginTop={5} marginBottom={2}>
              {formatMessage(messages.paymentParticationExplination, {
                basePayment: numberFormat(
                  data.rightsPortalCopaymentStatus?.basePayment ?? 0,
                ),
              })}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box marginBottom={4}>
          <Problem
            type="no_data"
            imgSrc="./assets/images/coffee.svg"
            titleSize="h3"
            noBorder={false}
          />
        </Box>
      )}
      {loading || periodsLoading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Box marginBottom={SECTION_GAP}>
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
                backgroundColor="blue"
              />
              <DatePicker
                size="xs"
                label={formatMessage(m.dateTo)}
                placeholderText={formatMessage(m.chooseDate)}
                handleChange={(date) => setEndDate(date)}
                selected={endDate}
                backgroundColor="blue"
              />
            </Box>
          </Box>
          {(periods?.rightsPortalCopaymentPeriods?.items.length ?? 0) > 0 && (
            <T.Table>
              <ExpandHeader
                data={[
                  { value: '' },
                  { value: formatMessage(messages.statusOfRights) },
                  { value: formatMessage(m.month) },
                  { value: formatMessage(messages.paymentTarget) },
                  { value: formatMessage(messages.monthlyPaymentShort) },
                  { value: formatMessage(messages.right) },
                  { value: formatMessage(messages.repaid) },
                ]}
              />
              <T.Body>
                {periods?.rightsPortalCopaymentPeriods.items &&
                  periods?.rightsPortalCopaymentPeriods.items.map(
                    (period, idx) => (
                      <ExpandRow
                        key={`period-row-${idx}`}
                        expandWhenLoadingFinished
                        backgroundColor="default"
                        loading={billsLoading}
                        onExpandCallback={() => getBills(period.id ?? 0)}
                        data={[
                          {
                            value: period.status?.display ?? '',
                          },
                          { value: period.month ?? '' },
                          {
                            value: amountFormat(period.maximumPayment ?? 0),
                          },
                          {
                            value: amountFormat(period.monthPayment ?? 0),
                          },
                          {
                            value: amountFormat(period.overpaid ?? 0),
                          },
                          {
                            value: amountFormat(period.repaid ?? 0),
                          },
                        ]}
                      >
                        <Box padding={2} paddingBottom={5} background="blue100">
                          <Text
                            marginBottom={1}
                            variant="default"
                            fontWeight="semiBold"
                          >
                            Sundurliðun reikninga í völdum mánuði
                          </Text>
                          <T.Table box={{ className: styles.subTable }}>
                            <T.Head>
                              <T.Row>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(m.service)}
                                </T.HeadData>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(m.dateOfInvoiceShort)}
                                </T.HeadData>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(m.totalPrice)}
                                </T.HeadData>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(
                                    messages.medicinePaidByInsuranceShort,
                                  )}
                                </T.HeadData>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(messages.yourPayment)}
                                </T.HeadData>
                                <T.HeadData
                                  text={{
                                    variant: 'small',
                                    fontWeight: 'semiBold',
                                  }}
                                >
                                  {formatMessage(messages.overpayment)}
                                </T.HeadData>
                              </T.Row>
                            </T.Head>
                            <T.Body>
                              {billsData?.rightsPortalCopaymentBills.items
                                .length &&
                                billsData?.rightsPortalCopaymentBills.items.map(
                                  (bill) => (
                                    <tr key={bill.id}>
                                      <T.Data>{bill.serviceType}</T.Data>
                                      <T.Data>
                                        {formatDateFns(bill.date, 'dd.MM.yyyy')}
                                      </T.Data>
                                      <T.Data>
                                        {amountFormat(bill.totalAmount ?? 0)}
                                      </T.Data>
                                      <T.Data>
                                        {amountFormat(
                                          bill.insuranceAmount ?? 0,
                                        )}
                                      </T.Data>
                                      <T.Data>
                                        {amountFormat(bill.ownAmount ?? 0)}
                                      </T.Data>
                                      <T.Data>
                                        {amountFormat(bill.overpaid ?? 0)}
                                      </T.Data>
                                    </tr>
                                  ),
                                )}
                              <tr>
                                <T.Data>
                                  <Text variant="small" fontWeight="semiBold">
                                    {formatMessage(m.total)}
                                  </Text>
                                </T.Data>
                                <T.Data />
                                <T.Data>
                                  <Text variant="small" fontWeight="semiBold">
                                    {amountFormat(
                                      billsData?.rightsPortalCopaymentBills.items.reduce(
                                        (acc, curr) =>
                                          (acc += curr.totalAmount ?? 0),
                                        0,
                                      ) ?? 0,
                                    )}
                                  </Text>
                                </T.Data>
                                <T.Data>
                                  <Text variant="small" fontWeight="semiBold">
                                    {amountFormat(
                                      billsData?.rightsPortalCopaymentBills.items.reduce(
                                        (acc, curr) =>
                                          (acc += curr.insuranceAmount ?? 0),
                                        0,
                                      ) ?? 0,
                                    )}
                                  </Text>
                                </T.Data>
                                <T.Data>
                                  <Text variant="small" fontWeight="semiBold">
                                    {amountFormat(
                                      billsData?.rightsPortalCopaymentBills.items.reduce(
                                        (acc, curr) =>
                                          (acc += curr.ownAmount ?? 0),
                                        0,
                                      ) ?? 0,
                                    )}
                                  </Text>
                                </T.Data>
                                <T.Data>
                                  <Text variant="small" fontWeight="semiBold">
                                    {amountFormat(
                                      billsData?.rightsPortalCopaymentBills.items.reduce(
                                        (acc, curr) =>
                                          (acc += curr.overpaid ?? 0),
                                        0,
                                      ) ?? 0,
                                    )}
                                  </Text>
                                </T.Data>
                              </tr>
                            </T.Body>
                          </T.Table>
                        </Box>
                      </ExpandRow>
                    ),
                  )}
              </T.Body>
            </T.Table>
          )}
        </Box>
      )}
      <Box>
        <Text variant="small" marginTop={5} marginBottom={2}>
          {formatMessage(messages.paymentParticationExplinationFooter)}
        </Text>
      </Box>
    </PaymentsWrapper>
  )
}

export default PaymentPartication
