import { useEffect, useRef } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { messages } from '../../lib/messages'

export const StepHeading = ({
  id,
  step,
  total,
  title,
}: {
  id: string
  step: number
  total: number
  title: string
}) => {
  const { formatMessage } = useLocale()
  const headingRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  return (
    <>
      <Text variant="eyebrow" color="foregroundBrandSecondary">
        {formatMessage(messages.stepCounter, { current: step, total })}
      </Text>
      <Box ref={headingRef} component="h2" id={id} marginTop={1} tabIndex={-1}>
        <Text variant="h5" as="span">
          {title}
        </Text>
      </Box>
    </>
  )
}
