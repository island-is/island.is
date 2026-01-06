import {
  Box,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
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
import { formatDateToMonthString } from '../../utils/format'
import {
  useGetCopaymentPeriodsQuery,
  useGetCopaymentStatusQuery,
} from './Payments.generated'
import { PaymentTableRow } from './PaymentTableRow'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const PaymentPartication = () => {
  const { formatMessage, lang } = useLocale()

  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { years: 1 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())

  const { data, loading, error } = useGetCopaymentStatusQuery()

  const { data: periods, loading: periodsLoading } =
    useGetCopaymentPeriodsQuery({
      variables: {
        input: {
          dateTo: endDate,
          dateFrom: startDate,
        },
      },
    })

  if (error) {
    return (
      <PaymentsWrapper pathname={HealthPaths.HealthPaymentParticipation}>
        <Problem noBorder={false} error={error} />
      </PaymentsWrapper>
    )
  }

  return (
    <PaymentsWrapper pathname={HealthPaths.HealthPaymentParticipation}>
      <Box>
        <StackWithBottomDivider space={2}>
          <UserInfoLine
            titlePadding={2}
            label={formatMessage(messages.maximumMonthlyPayment)}
            content={amountFormat(
              data?.rightsPortalCopaymentStatus?.maximumMonthlyPayment ?? 0,
            )}
            loading={loading}
          />
          <UserInfoLine
            label={formatMessage(messages.paymentTarget)}
            content={amountFormat(
              data?.rightsPortalCopaymentStatus?.maximumPayment ?? 0,
            )}
            loading={loading}
          />
        </StackWithBottomDivider>
        <Box marginBottom={SECTION_GAP}>
          <Text variant="small" marginTop={5} marginBottom={2}>
            {formatMessage(messages.paymentParticationExplanation, {
              basePayment: numberFormat(
                data?.rightsPortalCopaymentStatus?.basePayment ?? 0,
              ),
            })}
          </Text>
        </Box>
      </Box>
      {!data?.rightsPortalCopaymentStatus && (
        <Box marginBottom={4}>
          <Problem
            type="no_data"
            imgSrc="./assets/images/coffee.svg"
            titleSize="h3"
            noBorder={false}
          />
        </Box>
      )}
      {periodsLoading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Stack space={[2, SECTION_GAP]}>
          <Text variant="h5">{formatMessage(messages.period)}</Text>
          <GridContainer>
            <GridRow
              marginBottom={CONTENT_GAP}
              direction={['column', 'column', 'column', 'row']}
            >
              <GridColumn
                span={['6/8', '6/8', '6/8', '4/8']}
                paddingBottom={[CONTENT_GAP, CONTENT_GAP, CONTENT_GAP, 0]}
              >
                <DatePicker
                  size="xs"
                  label={formatMessage(m.dateFrom)}
                  placeholderText={formatMessage(m.chooseDate)}
                  handleChange={(date) => setStartDate(date)}
                  selected={startDate}
                  backgroundColor="blue"
                  locale={lang}
                />
              </GridColumn>
              <GridColumn span={['6/8', '6/8', '6/8', '4/8']}>
                <DatePicker
                  size="xs"
                  label={formatMessage(m.dateTo)}
                  placeholderText={formatMessage(m.chooseDate)}
                  handleChange={(date) => setEndDate(date)}
                  selected={endDate}
                  backgroundColor="blue"
                  locale={lang}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
          {(periods?.rightsPortalCopaymentPeriods?.items.length ?? 0) > 0 ? (
            <>
              <Hidden below="md">
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
                        (period, idx) => {
                          if (!period.id) {
                            return null
                          }
                          return (
                            <PaymentTableRow
                              key={`payment-table-row-${idx}`}
                              periodId={period.id}
                              headerData={[
                                period.status?.display ?? '',
                                period.month ?? '',
                                amountFormat(period.maximumPayment ?? 0),
                                amountFormat(period.monthPayment ?? 0),
                                amountFormat(period.overpaid ?? 0),
                                amountFormat(period.repaid ?? 0),
                              ]}
                            />
                          )
                        },
                      )}
                  </T.Body>
                </T.Table>
              </Hidden>
              <Hidden above="sm">
                {
                  <MobileTable
                    rows={
                      periods?.rightsPortalCopaymentPeriods.items.map(
                        (period, index) => ({
                          key: index,
                          title:
                            formatDateToMonthString('', period.month ?? '') ??
                            formatMessage(m.month),
                          data: [
                            {
                              title: formatMessage(messages.statusOfRights),
                              content: period.status?.display ?? '',
                            },
                            {
                              title: formatMessage(messages.paymentTarget),
                              content: amountFormat(period.maximumPayment ?? 0),
                            },
                            {
                              title: formatMessage(
                                messages.monthlyPaymentShort,
                              ),
                              content: amountFormat(period.monthPayment ?? 0),
                            },
                            {
                              title: formatMessage(messages.right),
                              content: amountFormat(period.overpaid ?? 0),
                            },
                            {
                              title: formatMessage(messages.repaid),
                              content: amountFormat(period.repaid ?? 0),
                            },
                          ],
                        }),
                      ) ?? []
                    }
                  />
                }
              </Hidden>
            </>
          ) : (
            <Box marginTop={2}>
              <Problem
                type="no_data"
                title={formatMessage(messages.searchResultsEmpty)}
                message={formatMessage(messages.searchResultsEmptyDetail)}
                titleSize="h3"
                noBorder={false}
                tag={undefined}
              />
            </Box>
          )}
          {periods?.rightsPortalCopaymentPeriods?.items?.length ? (
            <DownloadFileButtons
              BoxProps={{
                paddingTop: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flexEnd',
              }}
              buttons={[
                {
                  text: formatMessage(m.getAsExcel),
                  onClick: () =>
                    exportPaymentParticipationOverview(
                      periods?.rightsPortalCopaymentPeriods?.items ?? [],
                    ),
                },
              ]}
            />
          ) : undefined}
        </Stack>
      )}
      <Box>
        <Text variant="small" marginTop={5} marginBottom={2}>
          {formatMessage(messages.paymentParticationExplanationFooter)}
        </Text>
      </Box>
    </PaymentsWrapper>
  )
}

export default PaymentPartication
