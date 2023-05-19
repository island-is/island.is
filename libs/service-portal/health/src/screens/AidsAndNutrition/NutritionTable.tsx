import { AidOrNutrition } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FC } from 'react'
import {
  ExpandHeader,
  amountFormat,
  formatDate,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import ExpiringTable from '../../components/ExpiringTable/ExpiringTable'
import { ExpiringExpandedTableRow } from '../../components/ExpiringTable/ExpiringExpandedTableRow'

interface Props {
  data: Array<AidOrNutrition>
  footnote: string
  link: string
  linkText: string
}

const NutritionTable: FC<Props> = ({ data, footnote, link, linkText }) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <ExpiringTable
      header={
        <ExpandHeader
          data={[
            { value: '' },
            { value: formatMessage(messages.name) },
            { value: formatMessage(messages.maxAmountPerMonth) },
            { value: formatMessage(messages.insuranceRatio) },
            { value: formatMessage(messages.availableRefund) },
            { value: formatMessage(messages.nextAvailableRefund) },
          ]}
        />
      }
      footnote={footnote}
      link={link}
      linkText={linkText}
    >
      {data.map((rowItem, idx) => (
        <ExpiringExpandedTableRow
          key={idx}
          expiring={rowItem.expiring}
          visibleValues={[
            rowItem.name ?? '-',
            rowItem.available ?? '-',
            rowItem.refund.type === 'amount'
              ? rowItem.refund.value
                ? amountFormat(rowItem.refund.value)
                : '-'
              : rowItem.refund.value
              ? `${rowItem.refund.value}%`
              : '-',
            rowItem.available ?? '-',
            rowItem.nextAllowedMonth ?? '-',
          ]}
          foldedValues={{
            columns: [
              formatMessage(messages.availableTo),
              formatMessage(messages.extraDetail),
            ],
            values: [
              rowItem.validUntil ? formatDate(rowItem.validUntil) : '-',
              rowItem.explanation ?? '-',
            ],
          }}
        />
      ))}
    </ExpiringTable>
  )
}

export default NutritionTable
