import { RightsPortalDentistBill } from '@island.is/api/schema'
import {
  Box,
  Hidden,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  DownloadFileButtons,
  formatDate,
  m,
  NestedLines,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { exportDentistFile } from '../../utils/FileBreakdown'
import { MobileTable } from '@island.is/portals/my-pages/core'

interface Props {
  bills: Array<RightsPortalDentistBill>
  loading?: boolean
}

type TotalBills = {
  totalCharge: number
  totalCovered: number
}

const BillsTable = ({ bills, loading = false }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  if (!bills.length && !loading) {
    return (
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
    )
  }

  const totalBills = bills.reduce(
    (total, bill) => ({
      totalCharge: total.totalCharge + (bill.amount ?? 0),
      totalCovered: total.totalCovered + (bill.coveredAmount ?? 0),
    }),
    {
      totalCharge: 0,
      totalCovered: 0,
    } as TotalBills,
  )

  return (
    <Box marginTop="containerGutter">
      {loading && <LoadingDots />}

      <Hidden below="md">
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(m.number)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(m.date)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(messages.repaid)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(messages.dentistCharge)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(messages.amountRefundedByInsurance)}
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {bills.map((rowItem, index) => (
              <T.Row key={index}>
                <T.Data>
                  <Text variant="medium">{rowItem.number}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {rowItem.date ? formatDate(rowItem.date) : ''}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {rowItem.refundDate ? formatDate(rowItem.refundDate) : ''}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {rowItem.amount ? amountFormat(rowItem.amount) : ''}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {rowItem.coveredAmount
                      ? amountFormat(rowItem.coveredAmount)
                      : ''}
                  </Text>
                </T.Data>
              </T.Row>
            ))}
            <T.Row key="total-row">
              <T.Data>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(m.total)}
                </Text>
              </T.Data>
              <T.Data></T.Data>
              <T.Data></T.Data>
              <T.Data>
                <Text variant="medium" fontWeight="semiBold">
                  {totalBills.totalCharge
                    ? amountFormat(totalBills.totalCharge)
                    : ''}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium" fontWeight="semiBold">
                  {totalBills.totalCovered
                    ? amountFormat(totalBills.totalCovered)
                    : ''}
                </Text>
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Hidden>
      <Hidden above="sm">
        <MobileTable
          rows={bills.map((item) => ({
            title:
              formatMessage(m.number) + ': ' + item.number?.toString() || '',
            data: [
              {
                title: formatMessage(m.date),
                content: item.date ? formatDate(item.date) : '',
              },
              {
                title: formatMessage(messages.repaid),
                content: item.refundDate ? formatDate(item.refundDate) : '',
              },
              {
                title: formatMessage(messages.dentistCharge),
                content: item.amount ? amountFormat(item.amount) : '',
              },
              {
                title: formatMessage(messages.amountRefundedByInsurance),
                content: item.coveredAmount
                  ? amountFormat(item.coveredAmount)
                  : '',
              },
            ],
          }))}
        />
        <Box marginTop={4}>
          <Text variant="eyebrow">{formatMessage(m.total)}</Text>
          <NestedLines
            data={[
              {
                title: formatMessage(messages.dentistCharge),
                value: totalBills.totalCharge
                  ? amountFormat(totalBills.totalCharge)
                  : '',
              },
              {
                title: formatMessage(messages.amountRefundedByInsurance),
                value: totalBills.totalCovered
                  ? amountFormat(totalBills.totalCovered)
                  : '',
              },
            ]}
          />
        </Box>
      </Hidden>

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
              exportDentistFile(bills ?? [], 'xlsx', {
                charge: totalBills.totalCharge,
                covered: totalBills.totalCovered,
              }),
          },
        ]}
      />
    </Box>
  )
}

export default BillsTable
