import React, { createContext, useState } from 'react'
import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'
import { Divider } from '../Divider/Divider'

interface AccordionContextValue {
  toggledId: string
  setToggledId: (id: string) => void
}

export const AccordionContext = createContext<AccordionContextValue>({
  toggledId: '',
  setToggledId: () => null,
})

export interface AccordionProps {
  children: ReactNodeNoStrings
  dividers?: boolean
  dividerOnTop?: boolean
  dividerOnBottom?: boolean
  singleExpand?: boolean
}

export const Accordion = ({
  children,
  boolean,
  dividers = true,
  dividerOnTop = true,
  dividerOnBottom = true,
  singleExpand = true,
}: AccordionProps) => {
  const [toggledId, setToggledId] = useState<string>('')

  const Accordions = singleExpand ? (
    <AccordionContext.Provider
      value={{
        toggledId,
        setToggledId,
      }}
    >
      <Stack space={2} dividers={dividers}>
        {children}
      </Stack>
    </AccordionContext.Provider>
  ) : (
    <Stack space={2} dividers>
      {children}
    </Stack>
  )

  return (
    <Box>
      {dividerOnTop && <Divider />}
      <Box paddingY={2}>{Accordions}</Box>
      {dividerOnBottom && <Divider />}
    </Box>
  )
}

export default Accordion
