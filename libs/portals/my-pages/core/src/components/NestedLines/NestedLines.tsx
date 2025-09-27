import {
  Box,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './NestedLines.css'
import useIsMobile from '../../hooks/useIsMobile/useIsMobile'
import { LinkButton } from '../LinkButton/LinkButton'

interface Props {
  data: {
    title: string
    value?: string | number | React.ReactElement | string[]
    type?: 'text' | 'link' | 'action'
    href?: string
    action?: () => void
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
        {data.map((item, i) => {
          const value = Array.isArray(item.value)
            ? item.value.join(', ')
            : item.value
          return (
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
                      {item.type === 'link' && item.href ? (
                        <LinkButton
                          text={value?.toString() ?? ''}
                          to={item.href ?? ''}
                          variant="text"
                        />
                      ) : item.type === 'action' && item.action ? (
                        <Button
                          as="span"
                          size="small"
                          variant="text"
                          unfocusable
                          icon="open"
                          iconType="outline"
                          onClick={item.action}
                          title={value?.toString() ?? ''}
                        >
                          {value}
                        </Button>
                      ) : (
                        <Text variant="small" as="span">
                          {value}
                        </Text>
                      )}
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          )
        })}
      </GridContainer>
    </Box>
  )
}
