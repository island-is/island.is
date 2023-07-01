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

const NutritionTable: FC<React.PropsWithChildren<Props>> = ({
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
            { value: formatMessage(messages.maxAmountPerMonth) },
            {
              value: formatMessage(
                messages.insuranceRatioOrInitialApplicantPayment,
              ),
            },
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
            rowItem.name ?? '',
            rowItem.available ?? '',
            rowItem.refund.type === 'amount'
              ? rowItem.refund.value
                ? amountFormat(rowItem.refund.value)
                : ''
              : rowItem.refund.value
              ? `${rowItem.refund.value}%`
              : '',
            rowItem.available ?? '',
            rowItem.nextAllowedMonth ?? '',
          ]}
          foldedValues={[
            {
              title: formatMessage(messages.availableTo),
              value: rowItem.validUntil ? formatDate(rowItem.validUntil) : '',
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

export default NutritionTable
