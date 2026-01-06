import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'
import { formatNationalId, DirectTaxPayment, getMonth } from '../../lib'
import TaxBreakdownHeadline from './TaxBreakdownHeadline'
import groupBy from 'lodash/groupBy'
interface Dictionary<T> {
  [index: string]: T
}

import * as styles from './TaxBreakdown.css'

export const taxBreakDownHeaders = [
  'Fyrirtæki',
  'Heildarlaun',
  'Persónuafsláttur',
  'Staðgreiðsla',
]

interface Props {
  items: DirectTaxPayment[]
  dateDataWasFetched?: string
}

const TaxBreakdown = ({ items, dateDataWasFetched }: Props) => {
  const date = dateDataWasFetched ? new Date(dateDataWasFetched) : new Date()

  const isKeyInArray = (
    grouped: Dictionary<DirectTaxPayment[]>,
    month: number,
    year: number,
  ) => {
    if (!grouped[month]) {
      grouped[month] = [{ year, month } as DirectTaxPayment]
    }
  }

  const fillInDictionary = (grouped: Dictionary<DirectTaxPayment[]>) => {
    if (Object.keys(grouped).length === 3) {
      return grouped
    }
    for (let i = 1; i <= 3; i++) {
      const prevMonth = date.getMonth() - i
      const year = date.getFullYear()

      if (prevMonth < 0) {
        isKeyInArray(grouped, prevMonth + 13, year - 1)
      } else {
        isKeyInArray(grouped, prevMonth + 1, year)
      }
    }
    return grouped
  }
  const itemsGrouped = groupBy(items, (item) => item.month)

  return (
    <table className={styles.tableContainer}>
      <thead>
        <tr className={styles.tableHeaders}>
          {taxBreakDownHeaders.map((head) => {
            return (
              <th key={head}>
                <Text variant="small" fontWeight="semiBold">
                  {head}
                </Text>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {Object.entries(fillInDictionary(itemsGrouped))
          .sort(
            (a, b) =>
              a[1][0].year - b[1][0].year || a[1][0].month - b[1][0].month,
          )
          .map(([month, monthItems]) => {
            const monthNumber = parseInt(month) - 1
            return (
              <React.Fragment key={month}>
                <TaxBreakdownHeadline
                  key={`${month}-taxHeadline`}
                  headline={`${getMonth(
                    monthNumber < 0 ? 12 + monthNumber : monthNumber,
                  )} ${monthItems[0].year}`}
                />
                {monthItems.map((item, index) =>
                  item.payerNationalId ? (
                    <TaxBreakdownItem
                      key={`${index}-${item.month}-taxBreakdown-${item.payerNationalId}`}
                      items={[
                        formatNationalId(item.payerNationalId),
                        `${item.totalSalary.toLocaleString('de-DE')} kr.`,
                        `${item.personalAllowance.toLocaleString('de-DE')} kr.`,
                        `${item.withheldAtSource.toLocaleString('de-DE')} kr.`,
                      ]}
                    />
                  ) : (
                    <TaxBreakdownItem
                      key={`${index}-${item.month}-taxBreakdown-${item.payerNationalId}`}
                      items={['Engin staðgreiðsla']}
                    />
                  ),
                )}
              </React.Fragment>
            )
          })}
      </tbody>
    </table>
  )
}

export default TaxBreakdown
