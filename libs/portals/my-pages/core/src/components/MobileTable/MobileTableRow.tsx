import { Box, Button, Divider, Stack, Text } from '@island.is/island-ui/core'
import { isDefined } from 'class-validator'
import React, { useEffect, useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import * as styles from './MobileTable.css'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
export interface TableRow {
  title: string
  data: {
    title: string
    content?: React.ReactElement | JSX.Element | string
  }[]
  action?: React.ReactElement | JSX.Element | string
  children?:
    | React.ReactElement
    | JSX.Element
    | Array<React.ReactElement | JSX.Element>
    | null
  onExpandCallback?: () => void
}
interface Props {
  tableRow: TableRow
  inner?: boolean
  background?: 'white' | 'blue'
  first?: boolean
}

const MobileTableRow: React.FC<Props> = ({
  tableRow,
  inner,
  background,
  first,
}) => {
  const [extended, setExtended] = useState(false)
  const { formatMessage } = useLocale()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (extended)
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [extended])

  return (
    <Box
      className={cn({
        [styles.container]: extended,
        [styles.divider]: !extended && !inner,
      })}
      padding={inner ? 1 : 0}
      paddingTop={3}
      marginTop={first ? 0 : 3}
      marginBottom={extended ? 2 : 0}
      position="relative"
      background={
        extended || background === 'blue'
          ? 'blue100'
          : background === 'white'
          ? 'white'
          : undefined
      }
    >
      <Box
        marginBottom={1}
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
      >
        <Text variant="h4" as="h2" color="blue400">
          {tableRow.title}
        </Text>
        {!inner && (tableRow.children || tableRow.onExpandCallback) && (
          <Box marginLeft={1}>
            <Button
              title={
                extended ? formatMessage(m.collapse) : formatMessage(m.expand)
              }
              role="button"
              name="expand-button"
              circle
              icon={extended ? 'remove' : 'add'}
              onClick={() => {
                if (tableRow.onExpandCallback) tableRow.onExpandCallback()
                setExtended(!extended)
              }}
              colorScheme="light"
            />
          </Box>
        )}
      </Box>
      {/* Map through data */}
      <Box marginBottom={2}>
        <Stack space={1}>
          {tableRow.data
            .filter((item) => isDefined(item.content))
            .map((item, index) => {
              const { title, content } = item
              return (
                <Box key={index} display="flex" flexDirection="row">
                  <Box width="half" display="flex" alignItems="center">
                    <Text fontWeight="semiBold" variant="default">
                      {title}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="default" fontWeight="regular">
                      {content}
                    </Text>
                  </Box>
                </Box>
              )
            })}
        </Stack>
      </Box>
      <Box width="full" marginY={1}>
        {tableRow.action}
      </Box>
      {/* Children - visible when extended */}
      {extended && (
        <AnimateHeight height={extended ? 'auto' : 0} duration={800}>
          <Box paddingTop={2} paddingBottom={3}>
            <Divider />
          </Box>
          <Box ref={ref}>{tableRow.children}</Box>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default MobileTableRow
