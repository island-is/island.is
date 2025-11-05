import React, { useCallback, useState } from 'react'
import AnimateHeight, { Height } from 'react-animate-height'

import {
  Box,
  Button,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './ExpandableTable.css'

interface Props {
  data: Array<{
    value: string | number | React.ReactElement
    align?: 'left' | 'right'
  }>
  last?: boolean
  loading?: boolean
  backgroundColor?: 'white' | 'default'
  forceBackgroundColor?: boolean
  extraChildrenPadding?: boolean
  showLine?: boolean
  expandWhenLoadingFinished?: boolean
  onExpandCallback?: () => void
  startExpanded?: boolean
  children?: React.ReactNode
}

export const ExpandableTableRow = ({
  data,
  onExpandCallback,
  backgroundColor = 'default',
  children,
  last,
  loading,
  extraChildrenPadding,
  showLine = true,
  expandWhenLoadingFinished = false,
  startExpanded = false,
}: Props) => {
  const [expanded, toggleExpand] = useState<boolean>(startExpanded)
  const [closed, setClosed] = useState<boolean>(!startExpanded)

  const handleAnimationEnd = useCallback((height: Height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  const onExpandButton = () => {
    if (onExpandCallback && !expanded) {
      onExpandCallback()
    }
    toggleExpand(!expanded)
  }

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

  const shouldExpand = expandWhenLoadingFinished
    ? !loading && children && expanded
    : children && expanded

  return (
    <>
      <T.Row>
        <T.Data
          box={{
            alignItems: 'flexEnd',
            background: color,
            borderColor: borderColor,
            position: 'relative',
          }}
        >
          {!fullClose && !loading && showLine ? (
            <div className={styles.line} />
          ) : null}
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
        {data.map((item, i) => (
          <T.Data
            key={i}
            box={{
              background: color,
              borderColor: borderColor,
              position: 'relative',
            }}
          >
            <Text variant={last ? 'eyebrow' : 'medium'}>
              {item.value}
            </Text>
          </T.Data>
        ))}
      </T.Row>
      <T.Row>
        <T.Data
          style={{
            padding: 0,
            width: '100%',
            paddingTop:
              extraChildrenPadding && expanded && !loading
                ? theme.spacing[4]
                : 0,
            paddingBottom:
              extraChildrenPadding && expanded && !loading
                ? theme.spacing[4]
                : 0,
          }}
          box={{ position: 'relative' }}
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
            {showLine && <div className={styles.line} />}
            {children}
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}
