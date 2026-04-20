import { useGetCopaymentBillsLazyQuery } from './Payments.generated'
import { useLocale } from '@island.is/localization'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import {
  DownloadFileButtons,
  ExpandRow,
  amountFormat,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { exportPaymentParticipationFile } from '../../utils/FileBreakdown'
import * as styles from './Payments.css'

interface Props {
  periodId: number
  headerData: Array<string | number | React.ReactElement>
}

export const PaymentTableRow = ({ periodId, headerData }: Props) => {
  const [getCopaymentBillsQuery, { data, loading }] =
    useGetCopaymentBillsLazyQuery()

  const { formatMessage } = useLocale()

  return (
    <ExpandRow
      key={`period-row-${periodId}`}
      expandWhenLoadingFinished
      backgroundColor="default"
      loading={loading}
      onExpandCallback={() =>
        getCopaymentBillsQuery({ variables: { input: { periodId } } })
      }
      data={headerData?.map((h) => {
        return {
          value: h,
        }
      })}
    >
      <Box padding={2} paddingBottom={5} background="blue100">
        <Text marginBottom={1} variant="default" fontWeight="semiBold">
          {formatMessage(messages.monthlyBreakdownOfInvoices)}
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
                {formatMessage(messages.insuranceShare)}
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
            {data?.rightsPortalCopaymentBills.items.length &&
              data?.rightsPortalCopaymentBills.items.map((bill) => (
                <tr key={bill.id}>
                  <T.Data>{bill.serviceType}</T.Data>
                  <T.Data>{formatDate(bill.date, 'dd.MM.yyyy')}</T.Data>
                  <T.Data>{amountFormat(bill.totalAmount ?? 0)}</T.Data>
                  <T.Data>{amountFormat(bill.insuranceAmount ?? 0)}</T.Data>
                  <T.Data>{amountFormat(bill.ownAmount ?? 0)}</T.Data>
                  <T.Data>{amountFormat(bill.overpaid ?? 0)}</T.Data>
                </tr>
              ))}
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
                    data?.rightsPortalCopaymentBills.items.reduce(
                      (acc, curr) => (acc += curr.totalAmount ?? 0),
                      0,
                    ) ?? 0,
                  )}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="small" fontWeight="semiBold">
                  {amountFormat(
                    data?.rightsPortalCopaymentBills.items.reduce(
                      (acc, curr) => (acc += curr.insuranceAmount ?? 0),
                      0,
                    ) ?? 0,
                  )}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="small" fontWeight="semiBold">
                  {amountFormat(
                    data?.rightsPortalCopaymentBills.items.reduce(
                      (acc, curr) => (acc += curr.ownAmount ?? 0),
                      0,
                    ) ?? 0,
                  )}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="small" fontWeight="semiBold">
                  {amountFormat(
                    data?.rightsPortalCopaymentBills.items.reduce(
                      (acc, curr) => (acc += curr.overpaid ?? 0),
                      0,
                    ) ?? 0,
                  )}
                </Text>
              </T.Data>
            </tr>
          </T.Body>
        </T.Table>
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
                exportPaymentParticipationFile(
                  data?.rightsPortalCopaymentBills?.items ?? [],
                  'xlsx',
                ),
            },
          ]}
        />
      </Box>
    </ExpandRow>
  )
}
