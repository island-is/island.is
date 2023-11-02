import { ExpandRow } from '@island.is/service-portal/core'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FC } from 'react'
import * as styles from './ExpiringExpandedTableRow.css'

interface Props {
  expiring: boolean
  visibleValues: Array<string | number | React.ReactElement>
  foldedValues: Array<{ title: string; value?: string | number }>
}

export const ExpiringExpandedTableRow: FC<React.PropsWithChildren<Props>> = ({
  expiring,
  visibleValues,
  foldedValues,
}) => {
  return (
    <ExpandRow
      forceBackgroundColor={expiring}
      backgroundColor={expiring ? 'yellow' : 'default'}
      data={visibleValues.map((val) => {
        return { value: val }
      })}
    >
      <Box padding={2} background="blue100">
        <GridContainer className={styles.grid}>
          <GridRow>
            {foldedValues.map((item, i) => (
              <GridColumn key={i} className={styles.col} span="4/12">
                <Box className={styles.innerCol}>
                  <Text fontWeight="semiBold" variant="medium" as="span">
                    {item.title}
                  </Text>
                </Box>
                <Box className={styles.innerCol}>
                  <Text variant="medium" as="span">
                    {item.value}
                  </Text>
                </Box>
              </GridColumn>
            ))}
          </GridRow>
        </GridContainer>
      </Box>
    </ExpandRow>
  )
}
