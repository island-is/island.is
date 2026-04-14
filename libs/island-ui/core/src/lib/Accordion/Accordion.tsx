import React, { createContext, useCallback, useMemo, useRef } from 'react'

import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'
import { Divider } from '../Divider/Divider'
import { BoxProps } from '../Box/types'

interface AccordionContextValue {
  variant?: 'mini' | 'small' | 'large'
  registerForSingleExpand?: (id: string, collapse: () => void) => () => void
  notifyExpanded?: (id: string) => void
}

export const AccordionContext = createContext<AccordionContextValue>({
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
  variant?: 'mini' | 'small' | 'large'
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
}: AccordionProps) => {
  const collapseRegistry = useRef<Map<string, () => void>>(new Map())
  const expandedItemId = useRef<string>('')

  const registerForSingleExpand = useCallback(
    (id: string, collapse: () => void) => {
      collapseRegistry.current.set(id, collapse)
      return () => {
        collapseRegistry.current.delete(id)
      }
    },
    [],
  )

  const notifyExpanded = useCallback((id: string) => {
    if (expandedItemId.current && expandedItemId.current !== id) {
      collapseRegistry.current.get(expandedItemId.current)?.()
    }
    expandedItemId.current = id
  }, [])

  const contextValue = useMemo(
    () =>
      singleExpand
        ? { variant, registerForSingleExpand, notifyExpanded }
        : { variant },
    [variant, singleExpand, registerForSingleExpand, notifyExpanded],
  )

  return (
    <Box>
      {dividerOnTop && <Divider />}
      <Box paddingY={3}>
        <AccordionContext.Provider value={contextValue}>
          <Stack space={3} dividers={dividers}>
            {children}
          </Stack>
        </AccordionContext.Provider>
      </Box>
      {dividerOnBottom && <Divider />}
    </Box>
  )
}
