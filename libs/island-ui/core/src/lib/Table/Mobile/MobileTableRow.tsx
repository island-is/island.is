import { Box } from '../../Box/Box'
import { Text } from '../../Text/Text'
import { Button } from '../../Button/Button'
import { isDefined } from 'class-validator'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AnimateHeight, { Height } from 'react-animate-height'

export interface TableRow {
  title: string
  data: {
    title: string
    content?: React.ReactElement | JSX.Element | string
  }[]
  action?: React.ReactElement | JSX.Element | string
  children?: React.ReactElement
}
interface Props {
  tableRow: TableRow
}

const MobileTableRow: React.FC<Props> = ({ tableRow }) => {
  const [extended, setExtended] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (extended)
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [extended])

  return (
    <Box
      borderRadius="standard"
      borderColor="blue200"
      border="standard"
      padding={2}
      marginBottom={2}
      background={extended ? 'blue100' : undefined}
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
        {tableRow.children && (
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
        {tableRow.data.map((item, index) => {
          const { title, content } = item
          // eslint-disable-next-line array-callback-return
          if (!isDefined(content)) return
          return (
            <Box key={index} display="flex" flexDirection="row">
              <Box width="half">
                <Text fontWeight="medium" variant="medium">
                  {title}
                </Text>
              </Box>
              <Box width="half">
                <Text variant="medium">{content}</Text>
              </Box>
            </Box>
          )
        })}
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
