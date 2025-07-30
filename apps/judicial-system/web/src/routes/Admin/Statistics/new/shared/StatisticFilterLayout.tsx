import { ReactNode } from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

export const FilterLayout = ({
  children,
  onClear,
}: {
  children?: ReactNode | undefined
  onClear: () => void
}) => {
  return (
    <Box marginBottom={4}>
      <SectionHeading title="Síur" />
      <BlueBox>
        <Box display="flex" flexDirection="column" rowGap={2}>
          {children}
        </Box>
        <Box display="flex" justifyContent="flexEnd" marginTop={1}>
          <Button
            size="small"
            variant="text"
            colorScheme="destructive"
            onClick={onClear}
          >
            Hreinsa
          </Button>
        </Box>
      </BlueBox>
    </Box>
  )
}
