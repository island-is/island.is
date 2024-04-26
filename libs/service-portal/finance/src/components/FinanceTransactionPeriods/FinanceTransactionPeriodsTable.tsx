import { Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { ExpandHeader } from '@island.is/service-portal/core'
import FinanceTransactionPeriodsTableRow from './FinanceTransactionPeriodsTableRow'
import { ChargeTypes } from './FinanceTransactionPeriodsTypes'
import { m as messages } from '../../lib/messages'

interface Props {
  records: ChargeTypes
}

const FinanceTransactionPeriodsTable = ({ records }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <T.Table>
      <ExpandHeader
        data={[
          { value: '', printHidden: true },
          { value: formatMessage(m.chargeType) },
          { value: formatMessage(messages.feeBase) },
          { value: formatMessage(messages.feeBaseDescription) },
          { value: formatMessage(messages.lastMovement) },
        ]}
      />
      <T.Body>
        {sortBy(records, (item) => {
          return item.lastMovementDate
        })
          .reverse()
          .map((record) => (
            <FinanceTransactionPeriodsTableRow
              key={record.iD}
              record={record}
            />
          ))}
      </T.Body>
    </T.Table>
  )
}

export default FinanceTransactionPeriodsTable
