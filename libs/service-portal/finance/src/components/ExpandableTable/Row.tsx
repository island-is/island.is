import React, { useState, useCallback, FC } from 'react'
import { useLocale } from '@island.is/localization'
import { ApolloError } from '@apollo/client'
import AnimateHeight from 'react-animate-height'
import {
  Box,
  Text,
  LoadingDots,
  Table as T,
  Hidden,
  Button,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import * as styles from './ExpandableTable.css'
import { tableStyles } from '@island.is/service-portal/core'

interface Props {
  data: Array<{
    value: string | number | React.ReactElement
    align?: 'left' | 'right'
    element?: boolean
  }>
  last?: boolean
  loading?: boolean
  error?: ApolloError
  onExpandCallback?: () => void
}

const ExpandableLine: FC<Props> = ({
  data,
  onExpandCallback,
  children,
  last,
  loading,
  error,
}) => {
  const { formatMessage } = useLocale()
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height) => {
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

  const fullClose = closed && !expanded
  return (
    <>
      <T.Row>
        <T.Data
          box={{
            alignItems: 'flexEnd',
            background: fullClose || loading ? 'transparent' : 'blue100',
            borderColor: fullClose || loading ? 'blue200' : 'blue100',
            printHidden: true,
            position: 'relative',
          }}
          style={tableStyles}
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
                title="Sundurliðun"
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
              justifyContent="flexEnd"
            >
              <LoadingDots single />
            </Box>
          )}
        </T.Data>
        {data.map((item, i) => (
          <T.Data
            key={i}
            box={{
              background: fullClose || loading ? 'transparent' : 'blue100',
              borderColor: fullClose || loading ? 'blue200' : 'blue100',
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
          style={{ padding: 0, width: '100%' }}
          box={{ position: 'relative' }}
          borderColor={closed && !expanded ? 'blue100' : 'blue200'}
          colSpan={data.length + 1}
        >
          <AnimateHeight
            onAnimationEnd={(props: { newHeight: number }) =>
              handleAnimationEnd(props.newHeight)
            }
            duration={300}
            height={children && expanded ? 'auto' : 0}
          >
            <div className={styles.line} />
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
