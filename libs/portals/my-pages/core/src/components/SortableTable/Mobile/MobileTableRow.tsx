import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { isDefined } from 'class-validator'
import React, { useEffect, useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'

export interface TableRow {
  title: string
  data: {
    title: string
    content?: React.ReactElement | JSX.Element | string
  }[]
  action?: React.ReactElement | JSX.Element | string
  children?: React.ReactElement | null
}
interface Props {
  tableRow: TableRow
  inner?: boolean
  background?: 'white' | 'blue'
}

const MobileTableRow: React.FC<Props> = ({ tableRow, inner, background }) => {
  const [extended, setExtended] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (extended)
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [extended])

  return (
    <Box
      borderRadius={inner ? undefined : 'standard'}
      borderColor={inner ? undefined : 'blue200'}
      border={inner ? undefined : 'standard'}
      padding={inner ? 1 : 2}
      marginBottom={2}
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
        {!inner && tableRow.children && (
          <Box>
            <Button
              circle
              icon={extended ? 'remove' : 'add'}
              onClick={() => setExtended(!extended)}
              colorScheme="light"
            />
          </Box>
        )}
      </Box>
      {/* Map through data */}
      <Box marginBottom={2}>
        <Stack space={1}>
          {tableRow.data.map((item, index) => {
            const { title, content } = item
            // eslint-disable-next-line array-callback-return
            if (!isDefined(content)) return
            return (
              <Box key={index} display="flex" flexDirection="row">
                <Box width="half" display="flex" alignItems="center">
                  <Text fontWeight="semiBold" variant="default">
                    {title}
                  </Text>
                </Box>
                <Box width="half">
                  <Text variant="default">{content}</Text>
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>
      <Box width="full">{tableRow.action}</Box>
      {/* Children - visible when extended */}
      {extended && (
        <AnimateHeight height={extended ? 'auto' : 0} duration={800}>
          <Box ref={ref}>{tableRow.children}</Box>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default MobileTableRow
