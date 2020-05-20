import React from 'react'
import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'
import { Divider } from '../Divider/Divider'

export interface AccordionProps {
  children: ReactNodeNoStrings
  dividerOnTop?: boolean
  dividerOnBottom?: boolean
}

export const Accordion = ({
  children,
  dividerOnTop = false,
  dividerOnBottom = true,
}: AccordionProps) => (
  <Box>
    {dividerOnTop && <Divider />}
    <Box paddingY="spacer0">
      <Stack space="spacer0" dividers>
        {children}
      </Stack>
    </Box>
    {dividerOnBottom && <Divider />}
  </Box>
)

export default Accordion
