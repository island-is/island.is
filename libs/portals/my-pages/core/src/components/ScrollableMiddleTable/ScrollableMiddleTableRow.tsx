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
  children: React.ReactNode
  last?: boolean
  loading?: boolean
  backgroundColor?: 'white' | 'default'
}

const ScrollableMiddleTableRow = ({
  data,
  backgroundColor = 'default',
  children,
  last,
  loading,
}: Props) => {
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

  const shouldExpand = children && expanded

  const fullClose = closed && !expanded
  const color =
    fullClose || loading
      ? 'transparent'
      : backgroundColor === 'default'
      ? 'blue100'
      : 'transparent'

  const borderColor =
    fullClose || loading
      ? 'blue200'
      : backgroundColor === 'default'
      ? 'blue100'
      : 'transparent'

  return (
    <>
      <T.Row>
        <T.Data
          box={{
            alignItems: 'flexEnd',
            background: color,
            borderColor: borderColor,
            padding: 2,
            left: 0,
            overflow: 'hidden',
            position: 'sticky',
            zIndex: 10,
          }}
        >
          {!fullClose && !loading ? <div className={styles.line} /> : null}
          {!last && !loading && (
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
            <T.Data
              key={i}
              box={{
                background: color,
                borderColor: borderColor,
                position: item.first ? 'sticky' : 'relative',
                padding: 2,
                className: item.first
                  ? styles.firstColumn
                  : item.last
                  ? styles.lastColumn
                  : undefined,
              }}
            >
              <Text variant={last ? 'eyebrow' : 'medium'} as="span">
                {item.value}
              </Text>
            </T.Data>
          )
        })}
      </T.Row>
      <T.Row>
        <T.Data
          style={{
            padding: 0,
            width: '100%',
            paddingTop: expanded && !loading ? theme.spacing[4] : 0,
            paddingBottom: expanded && !loading ? theme.spacing[4] : 0,
          }}
          box={{ position: 'sticky', left: 0 }}
          borderColor={
            closed && !expanded
              ? 'blue100'
              : backgroundColor === 'white'
              ? 'transparent'
              : 'blue200'
          }
          colSpan={data.length + 1}
        >
          <AnimateHeight
            onHeightAnimationEnd={(newHeight) => handleAnimationEnd(newHeight)}
            duration={300}
            height={shouldExpand ? 'auto' : 0}
          >
            <Box className={styles.line} />
            {children}
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}

export default ScrollableMiddleTableRow
