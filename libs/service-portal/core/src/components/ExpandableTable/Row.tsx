import React, { useState, useCallback, FC } from 'react'
import { useLocale } from '@island.is/localization'
import { ApolloError } from '@apollo/client'
import AnimateHeight, { Height } from 'react-animate-height'
import {
  Box,
  Text,
  LoadingDots,
  Table as T,
  Button,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as styles from './ExpandableTable.css'
import { tableStyles } from '../../utils/utils'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  data: Array<{
    value: string | number | React.ReactElement
    align?: 'left' | 'right'
  }>
  last?: boolean
  loading?: boolean
  error?: ApolloError
  backgroundColor?: 'white' | 'default' | 'yellow'
  forceBackgroundColor?: boolean
  extraChildrenPadding?: boolean
  showLine?: boolean

  expandWhenLoadingFinished?: boolean
  onExpandCallback?: () => void
}

const ExpandableLine: FC<React.PropsWithChildren<Props>> = ({
  data,
  onExpandCallback,
  backgroundColor = 'default',
  forceBackgroundColor = false,
  children,
  last,
  loading,
  extraChildrenPadding,
  showLine = true,
  expandWhenLoadingFinished = false,
  error,
}) => {
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

  function onExpandButton() {
    if (onExpandCallback && !expanded) {
      onExpandCallback()
    }
    toggleExpand(!expanded)
  }

  const getColor =
    backgroundColor === 'default'
      ? 'blue100'
      : backgroundColor === 'yellow'
      ? 'yellow300'
      : 'transparent'
  const fullClose = closed && !expanded
  const color = forceBackgroundColor
    ? getColor
    : fullClose || loading
    ? 'transparent'
    : getColor

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
          style={tableStyles}
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
        {data.map((item, i) => (
          <T.Data
            key={i}
            box={{
              background: color,
              borderColor: borderColor,
              position: 'relative',
            }}
            style={tableStyles}
          >
            <Text variant={last ? 'eyebrow' : 'medium'} as="span">
              <div
                className={
                  item.align === 'right' ? styles.financeTd : undefined
                }
              >
                {item.value}
              </div>
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
            {error && (
              <Box
                paddingY={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text variant="eyebrow" as="span">
                  {formatMessage(m.errorFetch)}
                </Text>
              </Box>
            )}
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}

export default ExpandableLine
