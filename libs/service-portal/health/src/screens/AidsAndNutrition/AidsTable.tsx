import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
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
  data: Array<RightsPortalAidOrNutrition>
  footnote: string
  link: string
  linkText: string
}

const AidsTable: FC<React.PropsWithChildren<Props>> = ({
  data,
  footnote,
  link,
  linkText,
}) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <ExpiringTable
      header={
        <ExpandHeader
          data={[
            { value: '' },
            { value: formatMessage(messages.name) },
            { value: formatMessage(messages.maxUnitRefund) },
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
            rowItem.name,
            rowItem.maxUnitRefund ?? '',
            rowItem.refund.type === 'amount'
              ? amountFormat(rowItem.refund.value)
              : `${rowItem.refund.value}%`,

            rowItem.available ?? '',
            rowItem.nextAllowedMonth ?? '',
          ]}
          foldedValues={[
            {
              title: formatMessage(messages.location),
              value: rowItem.location ?? '',
            },
            {
              title: formatMessage(messages.availableTo),
              value: formatDate(rowItem.validUntil),
            },
            {
              title: formatMessage(messages.availableEvery12Months),
              value: rowItem.allowed12MonthPeriod ?? '',
            },
            {
              title: formatMessage(messages.extraDetail),
              value: rowItem.explanation ?? '',
            },
          ]}
        />
      ))}
    </ExpiringTable>
  )
}

export default AidsTable
