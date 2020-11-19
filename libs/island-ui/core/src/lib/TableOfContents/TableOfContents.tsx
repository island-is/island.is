import React, { FC } from 'react'
import { blue200 } from '@island.is/island-ui/theme'
import { Text } from '../Text/Text'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'

interface Props {
  title: string
  headings: Array<string>
  onClick: (heading: string) => void
}

export const TableOfContents: FC<Props> = ({ title, headings, onClick }) => (
  <Box paddingX={4} paddingY={2} style={{ borderLeft: `1px solid ${blue200}` }}>
    <Stack space={1}>
      <Text variant="h5" as="h5">
        {title}
      </Text>
      {headings.map((text, id) => (
        <Box
          key={id}
          component="button"
          type="button"
          textAlign="left"
          onClick={() => onClick(text)}
        >
          <Text variant="small" color={'blue600'}>
            {text}
          </Text>
        </Box>
      ))}
    </Stack>
  </Box>
)

export default TableOfContents
