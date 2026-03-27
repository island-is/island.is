import { Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m,
  amountFormat,
  periodFormat,
  formatDate,
  NestedTable,
} from '@island.is/portals/my-pages/core'
import { ExpandRow, ExpandHeader } from '@island.is/portals/my-pages/core'
import { m as messages } from '../../lib/messages'
import { CustomerRecordsDetails } from '../../lib/types'

interface Props {
  recordsArray: Array<CustomerRecordsDetails>
}

const FinanceTransactionsTable = ({ recordsArray }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <T.Table>
      <ExpandHeader
        data={[
          { value: '', printHidden: true },
          { value: formatMessage(m.date) },
          { value: formatMessage(m.chargeType) },
          { value: formatMessage(m.feeItem) },
          { value: formatMessage(messages.feeBase) },
          { value: formatMessage(m.period) },
          { value: formatMessage(m.amount), align: 'right' },
        ]}
      />
      <T.Body>
        {recordsArray.map((record) => (
          <ExpandRow
            key={`${record.createTime}-${record.createDate}-${record.accountReference}-${record.reference}-${record.amount}`}
            data={[
              { value: formatDate(record.createDate) },
              { value: record.chargeType },
              { value: record.itemCode },
              { value: record.chargeItemSubject },
              { value: periodFormat(record.period) },
              { value: amountFormat(record.amount), align: 'right' },
            ]}
          >
            <NestedTable
              data={[
                {
                  title: formatMessage(m.effectiveDate),
                  value: formatDate(record.valueDate),
                },
                {
                  title: formatMessage(m.performingOrganization),
                  value: record.performingOrganization,
                },
                {
                  title: formatMessage(m.guardian),
                  value: record.collectingOrganization,
                },
                {
                  title: formatMessage(m.recordCategory),
                  value: record.category,
                },
                {
                  title: formatMessage(m.recordAction),
                  value: record.subCategory,
                },
                ...(record.actionCategory
                  ? [
                      {
                        title: formatMessage(m.actionCategory),
                        value: record.actionCategory,
                      },
                    ]
                  : []),
                {
                  title: formatMessage(m.reference),
                  value: record.reference,
                },
              ]}
            />
          </ExpandRow>
        ))}
      </T.Body>
    </T.Table>
  )
}

export default FinanceTransactionsTable
