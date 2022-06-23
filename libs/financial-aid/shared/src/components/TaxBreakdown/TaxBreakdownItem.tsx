import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './TaxBreakdown.css'
import { taxBreakDownHeaders } from './TaxBreakdown'

interface Props {
  items: Array<string | number>
}

const TaxBreakdownItem = ({ items }: Props) => {
  return (
    <tr className={styles.information}>
      {items.map((el, index) => {
        return (
          <td key={`taxbreakDownItem-${el}-${index}`}>
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
  )
}

export default TaxBreakdownItem
