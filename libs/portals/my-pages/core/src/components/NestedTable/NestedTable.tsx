import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NestedTable.css'

interface Props {
  data: Array<{ title: string; value?: string | number }>
}

export const NestedTable = ({ data }: Props) => {
  return (
    <Box padding={2} background="blue100">
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} span="6/12">
              <GridContainer
                className={cn(styles.innerGrid, {
                  [styles.white]: i % 4 === 0 || i % 4 === 1,
                })}
              >
                <GridRow>
                  <GridColumn span="6/12">
                    <Box className={styles.titleCol}>
                      <Text fontWeight="semiBold" variant="small" as="span">
                        {item.title}
                      </Text>
                    </Box>
                  </GridColumn>
                  <GridColumn span="6/12">
                    <Text variant="small" as="span">
                      {item.value}
                    </Text>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </Box>
  )
}
