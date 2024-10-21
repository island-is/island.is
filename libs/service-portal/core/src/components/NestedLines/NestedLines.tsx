import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NestedLines.css'

interface Props {
  data: {
    title: string
    value?: string | number | React.ReactElement
    type?: 'text' | 'link'
    href?: string
  }[]
  width?: 'full' | 'half'
}

export const NestedLines = ({ data, width = 'full' }: Props) => {
  const isHalf = width === 'half'
  const columnWidth = isHalf ? '6/12' : '9/12'
  const titleWidth = '3/12'
  const modulusCalculations = (index: number) => {
    return isHalf ? index % 4 === 0 || index % 4 === 1 : index % 2 === 0
  }
  return (
    <Box padding={2} background="blue100">
      <GridContainer className={styles.grid}>
        <GridRow>
          {data.map((item, i) => (
            <GridColumn key={i} span={isHalf ? '6/12' : '12/12'}>
              <GridContainer
                className={cn(styles.innerGrid, {
                  [styles.white]: modulusCalculations(i),
                })}
              >
                <GridRow>
                  <GridColumn span={titleWidth}>
                    <Box className={styles.titleCol}>
                      <Text fontWeight="semiBold" variant="small" as="span">
                        {item.title}
                      </Text>
                    </Box>
                  </GridColumn>
                  <GridColumn span={columnWidth}>
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
