import React, { useState, useCallback, FC } from 'react'
import { useLocale } from '@island.is/localization'
import AnimateHeight, { Height } from 'react-animate-height'
import {
  Box,
  Text,
  LoadingDots,
  Table as T,
  Button,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as styles from './ScrollableMiddleTableRow.css'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  data: Array<{
    value: string | number | React.ReactElement
    align?: 'left' | 'right'
    first?: boolean
    last?: boolean
  }>
  loading?: boolean
}

const ScrollableMiddleTableRow = ({ data, loading }: Props) => {
  const { formatMessage } = useLocale()
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height: Height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  const onExpandButton = () => {
    toggleExpand(!expanded)
  }

  return (
    <>
      <T.Row>
        <T.Data>
          {!loading && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
              onClick={onExpandButton}
              cursor="pointer"
            >
              <Button
                circle
                colorScheme="light"
                icon={expanded ? 'remove' : 'add'}
                iconType="filled"
                onClick={onExpandButton}
                preTextIconType="filled"
                size="small"
                title={formatMessage(m.financeBreakdown)}
                type="button"
                variant="primary"
              />
            </Box>
          )}
          {loading && (
            <Box
              className={styles.loader}
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
            >
              <LoadingDots single />
            </Box>
          )}
        </T.Data>
        {data.map((item, i) => {
          return (
            <T.Data key={i}>
              <Text>{item.value}</Text>
            </T.Data>
          )
        })}
      </T.Row>
      <T.Row>
        <T.Data>
          <AnimateHeight
            onHeightAnimationEnd={(newHeight) => handleAnimationEnd(newHeight)}
            duration={300}
            height={'auto'}
          >
            <Box className={styles.line} />
            <T.Table
              box={{
                marginLeft: 3,
              }}
            >
              {[[1], [2], [3]].map((d) => (
                <T.Row>
                  {d.map((dd, i) => (
                    <T.Data key={i}>
                      <Text>{dd}</Text>
                    </T.Data>
                  ))}
                </T.Row>
              ))}
            </T.Table>
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}

export default ScrollableMiddleTableRow
