import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NestedLines.css'
import useIsMobile from '../../hooks/useIsMobile/useIsMobile'

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
  const { isMobile } = useIsMobile()

  return (
    <Box background="blue100">
      <GridContainer className={styles.grid}>
        {data.map((item, i) => (
          <GridColumn
            key={i}
            span={isHalf && !isMobile ? '6/12' : '12/12'}
            className={cn(styles.noPadding, {
              [styles.white]: modulusCalculations(i),
            })}
          >
            <GridContainer className={cn(styles.innerGrid)}>
              <GridRow>
                <GridColumn
                  span={isMobile ? '6/12' : ['12/12', '12/12', titleWidth]}
                >
                  <Box className={styles.titleCol}>
                    <Text fontWeight="semiBold" variant="small" as="span">
                      {item.title}
                    </Text>
                  </Box>
                </GridColumn>
                <GridColumn
                  span={isMobile ? '6/12' : ['12/12', '12/12', columnWidth]}
                >
                  <Box className={styles.valueCol}>
                    <Text variant="small" as="span">
                      {item.value}
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </GridColumn>
        ))}
      </GridContainer>
    </Box>
  )
}
