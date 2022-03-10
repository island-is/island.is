import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './TaxBreakdown.css'
import { taxBreakDownHeaders } from './TaxBreakdown'

interface Props {
  headline: string
  items: Array<string | number>
}

const TaxBreakdownItem = ({ headline, items }: Props) => {
  return (
    <>
      <tr className={styles.headlineContainer}>
        <td colSpan={4}>{headline}</td>
      </tr>
      <tr className={styles.information}>
        {items.map((el, index) => {
          return (
            <td key={`taxbreakDownItem-${el}-${index}-${headline}`}>
              <Box display={['block', 'none', 'none', 'none']}>
                <Text variant="small" fontWeight="semiBold" marginBottom={1}>
                  {taxBreakDownHeaders[index]}
                </Text>
              </Box>

              {el}
            </td>
          )
        })}
      </tr>
    </>
  )
}

export default TaxBreakdownItem
