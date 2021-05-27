import React from 'react'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'

interface Props {
  title: string
  id: string
  children: React.ReactNode
}

const BorderedAccordion = ({ title, id, children }: Props) => {
  return (
    <Box paddingX={[2, 2, 2, 4]} paddingY={[0, 0, 0, 2]} border="standard">
      <Accordion dividerOnBottom={false} dividerOnTop={false}>
        <AccordionItem id={id} label={title}>
          {children}
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default BorderedAccordion
