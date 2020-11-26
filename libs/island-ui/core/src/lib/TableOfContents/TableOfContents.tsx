import React, { FC } from 'react'
import { Button } from 'reakit/Button'
import { Text } from '../Text/Text'
import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Stack } from '../Stack/Stack'

interface Props {
  tableOfContentsTitle: string
  headings: Array<{ headingTitle: string; headingId: string }>
  onClick: (selectedHeadingId: string) => void
}

export const TableOfContents: FC<Props> = ({
  tableOfContentsTitle,
  headings,
  onClick,
}) => (
  <Box
    paddingX={4}
    paddingY={2}
    borderLeftWidth="standard"
    borderColor="blue200"
  >
    <Stack space={1}>
      <Text variant="h5" as="h5">
        {tableOfContentsTitle}
      </Text>
      {headings.map(({ headingTitle, headingId }, id) => (
        <FocusableBox
          key={id}
          component={Button}
          type="button"
          textAlign="left"
          onClick={() => onClick(headingId)}
        >
          <Text variant="small" color={'blue600'}>
            {headingTitle}
          </Text>
        </FocusableBox>
      ))}
    </Stack>
  </Box>
)

export default TableOfContents
