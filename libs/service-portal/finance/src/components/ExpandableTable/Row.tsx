import React, { useState, useCallback, FC } from 'react'
import AnimateHeight from 'react-animate-height'
import { Table as T } from '@island.is/island-ui/core'
import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './ExpandableTable.treat'

interface Props {
  data: Array<string | number>
  onExpandCallback?: () => void
}

const ExpandableLine: FC<Props> = ({ data, onExpandCallback, children }) => {
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
        {data.map((item, i) => (
          <T.Data
            key={i}
            box={{
              background: closed && !expanded ? 'transparent' : 'blue100',
              borderColor: closed && !expanded ? 'blue200' : 'blue100',
              position: 'relative',
            }}
          >
            {!fullClose && i === 0 ? <div className={styles.line} /> : null}
            {item}
          </T.Data>
        ))}
        <T.Data
          box={{
            alignItems: 'flexEnd',
            background: closed && !expanded ? 'transparent' : 'blue100',
            borderColor: closed && !expanded ? 'blue200' : 'blue100',
          }}
        >
          <Box display="flex" alignItems="flexEnd" justifyContent="flexEnd">
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
        </T.Data>
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
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}

export default ExpandableLine
