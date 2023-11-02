import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { ExpandHeader } from '@island.is/service-portal/core'
import FinanceTransactionPeriodsTableRow from './FinanceTransactionPeriodsTableRow'
import { ChargeTypes } from './FinanceTransactionPeriodsTypes'

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
          { value: formatMessage(m.feeBase) },
          { value: formatMessage(m.feeBaseDescription) },
          { value: formatMessage(m.lastMovement) },
        ]}
      />
      <T.Body>
        {sortBy(records, (item) => {
          return item.lastMovementDate
        })
          .reverse()
          .map((record) => (
            <FinanceTransactionPeriodsTableRow
              key={record.ID}
              record={record}
            />
          ))}
      </T.Body>
    </T.Table>
  )
}

export default FinanceTransactionPeriodsTable
