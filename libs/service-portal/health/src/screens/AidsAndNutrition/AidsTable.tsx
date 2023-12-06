import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
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

const AidsTable = ({ data, footnote, link, linkText }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const generateFoldedValues = (rowItem: RightsPortalAidOrNutrition) => {
    const foldedValues = []

    foldedValues.push({
      title: formatMessage(messages.location),
      value: rowItem.location ? rowItem.location : '',
    })

    foldedValues.push({
      title: formatMessage(messages.availableTo),
      value: rowItem.validUntil ? formatDate(rowItem.validUntil) : '',
    })

    foldedValues.push({
      title: formatMessage(messages.availableEvery12Months),
      value: rowItem.allowed12MonthPeriod ? rowItem.allowed12MonthPeriod : '',
    })

    foldedValues.push({
      title: formatMessage(messages.extraDetail),
      value: rowItem.explanation ? rowItem.explanation : '',
    })

    return foldedValues
  }

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
            rowItem.name.split('/').join(' / '),
            rowItem.maxUnitRefund ?? '',
            rowItem.refund.type === 'amount'
              ? amountFormat(rowItem.refund.value)
              : `${rowItem.refund.value}%`,

            rowItem.available ?? '',
            rowItem.nextAllowedMonth ?? '',
          ]}
          foldedValues={generateFoldedValues(rowItem)}
        />
      ))}
    </ExpiringTable>
  )
}

export default AidsTable
