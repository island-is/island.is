import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'
import {
  DirectTaxPayment,
  formatNationalId,
  getMonth,
} from '@island.is/financial-aid/shared/lib'
import TaxBreakdownHeadline from './TaxBreakdownHeadline'
import groupBy from 'lodash/groupBy'

import * as styles from './TaxBreakdown.css'

export const taxBreakDownHeaders = [
  'Fyrirtæki',
  'Heildarlaun',
  'Persónuafsláttur',
  'Staðgreiðsla',
]

interface Props {
  items: DirectTaxPayment[]
}

const TaxBreakdown = ({ items }: Props) => {
  const date = new Date()
  const currentMonth = date.getMonth() + 1
  const currentYear = date.getFullYear()
  const itemsGrouped = groupBy(items, (item) => item.month)

  for (let i = 1; i <= 3; i++) {
    const month = currentMonth - i
    const year = month < 1 ? currentYear - 1 : currentYear

    if (!itemsGrouped[month]) {
      itemsGrouped[month] = [{ year, month } as DirectTaxPayment]
    }
  }

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
        {Object.entries(itemsGrouped)
          .sort((a, b) => a[1][0].month - b[1][0].month)
          .map(([month, monthItems]) => {
            const monthNumber = parseInt(month) - 1
            return (
              <>
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
                    <TaxBreakdownItem items={['Engin staðgreiðsla']} />
                  ),
                )}
              </>
            )
          })}
      </tbody>
    </table>
  )
}

export default TaxBreakdown
