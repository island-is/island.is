import React, { createContext, useState } from 'react'

import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'
import { Divider } from '../Divider/Divider'
import { BoxProps } from '../Box/types'

interface AccordionContextValue {
  toggledId: string
  setToggledId: (id: string) => void
  variant?: 'mini' | 'small' | 'large'
}

export const AccordionContext = createContext<AccordionContextValue>({
  toggledId: '',
  setToggledId: () => null,
  variant: undefined,
})

export interface AccordionProps {
  children: ReactNodeNoStrings
  /** @deprecated The spacing should always be 24 px. **/
  space?: BoxProps['paddingTop']
  dividers?: boolean
  dividerOnTop?: boolean
  dividerOnBottom?: boolean
  singleExpand?: boolean
  variant?: 'mini' |'small' | 'large'
  iconVariant?: 'purple' | 'default'
}

export const Accordion = ({
  children,
  space = 3,
  dividers = true,
  dividerOnTop = true,
  dividerOnBottom = true,
  singleExpand = true,
  variant = 'small',
  iconVariant = 'default'
}: AccordionProps) => {
  const [toggledId, setToggledId] = useState<string>('')

  const Accordions = singleExpand ? (
    <AccordionContext.Provider
      value={{
        toggledId,
        setToggledId,
        variant,
      }}
    >
      <Stack space={3} dividers={dividers}>
        {children}
      </Stack>
    </AccordionContext.Provider>
  ) : (
    <AccordionContext.Provider value={{ toggledId: '', setToggledId: () => null, variant }}>
      <Stack space={3} dividers={dividers}>
        {children}
      </Stack>
    </AccordionContext.Provider>
  )

  return (
    <Box>
      {dividerOnTop && <Divider />}
      <Box paddingY={3}>{Accordions}</Box>
      {dividerOnBottom && <Divider />}
    </Box>
  )
}
