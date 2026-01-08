import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import { isValidElement, ReactElement } from 'react'
import HtmlParser from 'react-html-parser'
import useIsMobile from '../../hooks/useIsMobile/useIsMobile'
import { LinkButton } from '../LinkButton/LinkButton'
import * as styles from './NestedLines.css'
import sanitizeHtml from 'sanitize-html'

interface Props {
  data: {
    title: string
    value?: string | number | ReactElement | string[]
    type?: 'text' | 'link' | 'action'
    href?: string
    splitValue?: 'new-line' | 'comma'
    boldTitle?: boolean
    boldValue?: boolean
    variant?: 'small' | 'default'
    action?: () => void
  }[]
  width?: 'full' | 'half'
  ratio?: '3:9' | '6:6'
  startColor?: 'white' | 'blue100'
}

export const NestedLines = ({
  data,
  width = 'full',
  ratio = '3:9',
  startColor = 'white',
}: Props) => {
  const isHalf = width === 'half'
  const columnWidth = isHalf || ratio === '6:6' ? '6/12' : '9/12'
  const titleWidth = ratio === '3:9' ? '3/12' : '6/12'
  const modulusCalculations = (index: number) => {
    return isHalf ? index % 4 === 0 || index % 4 === 1 : index % 2 === 0
  }
  const { isMobile } = useIsMobile()

  return (
    <Box background="blue100">
      <GridContainer className={styles.grid}>
        {data.map((item, i) => {
          const splitValue = item.splitValue ?? 'comma'
          const value = Array.isArray(item.value)
            ? item.value.join(splitValue === 'new-line' ? '<br/>' : ', ')
            : item.value
          const boldTitle = item.boldTitle ?? true
          const boldValue = item.boldValue ?? false
          const variant = item.variant ?? 'small'
          return (
            <GridColumn
              key={i}
              span={isHalf && !isMobile ? '6/12' : '12/12'}
              className={cn(styles.noPadding, {
                [styles.white]: modulusCalculations(
                  startColor === 'white' ? i : i + 1,
                ),
              })}
            >
              <GridContainer className={cn(styles.innerGrid)}>
                <GridRow>
                  <GridColumn
                    span={isMobile ? '6/12' : ['12/12', '12/12', titleWidth]}
                  >
                    <Box className={styles.titleCol}>
                      <Text
                        fontWeight={boldTitle ? 'medium' : 'regular'}
                        variant={variant}
                        as="span"
                      >
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
                        <Text
                          variant={variant}
                          as="span"
                          fontWeight={boldValue ? 'medium' : 'regular'}
                        >
                          {typeof value === 'object' && isValidElement(value)
                            ? value
                            : HtmlParser(
                                sanitizeHtml(value ? value.toString() : ''),
                              )}
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
