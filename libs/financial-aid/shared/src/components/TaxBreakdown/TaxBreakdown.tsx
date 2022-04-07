import React from 'react'
import { Text } from '@island.is/island-ui/core'
import TaxBreakdownItem from './TaxBreakdownItem'

import * as styles from './TaxBreakdown.css'
import {
  DirectTaxPayment,
  formatNationalId,
  getMonth,
} from '@island.is/financial-aid/shared/lib'
import TaxBreakdownHeadline from './TaxBreakdownHeadline'

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
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()
  const lastThreeMonths = []

  // Create an array with the year and month of the last three months
  for (let i = 1; i <= 3; i++) {
    const month = currentMonth - i
    const year = month < 0 ? currentYear - 1 : currentYear

    lastThreeMonths.unshift({ year, month: month < 0 ? 12 + month : month })
  }

  const filterTaxByMonth = (month: number) => {
    const taxInMonth = items.filter((item) => item.month - 1 === month)

    if (taxInMonth.length > 0) {
      return taxInMonth.map((item, i) => (
        <TaxBreakdownItem
          key={`${i}-${month}-taxBreakdown-${item.payerNationalId}`}
          items={[
            formatNationalId(item.payerNationalId),
            `${item.totalSalary.toLocaleString('de-DE')} kr.`,
            `${item.personalAllowance.toLocaleString('de-DE')} kr.`,
            `${item.withheldAtSource.toLocaleString('de-DE')} kr.`,
          ]}
        />
      ))
    }
    return <TaxBreakdownItem items={['Engin staðgreiðsla']} />
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
        {lastThreeMonths.map((i) => (
          <>
            <TaxBreakdownHeadline
              key={`${i.month}-taxHeadline`}
              headline={`${getMonth(i.month)} ${i.year}`}
            />
            {filterTaxByMonth(i.month)}
          </>
        ))}
      </tbody>
    </table>
  )
}

export default TaxBreakdown
