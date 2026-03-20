import React, { useRef, useState } from 'react'
import {
  Box,
  Button,
  FormStepperThemes,
  HistorySection,
  HistoryStepper,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useComponentSize from '@rehooks/component-size'
import AnimateHeight from 'react-animate-height'
import { ApplicationCardHistoryItem } from '../types'
import { coreMessages } from '@island.is/application/core'

type ApplicationCardHistorySize = 'sm' | 'lg'

interface Props {
  items: ApplicationCardHistoryItem[]
}

const sizeMapper: Record<ApplicationCardHistorySize, number> = {
  sm: 144,
  lg: 216,
}

export const ApplicationCardHistory = ({ items }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useLocale()
  const { height: historyHeight } = useComponentSize(containerRef)
  const size = items?.some((x) => !!x.content) ? 'lg' : 'sm'
  const maxHistoryHeight = sizeMapper[size]
  const [historyState, setHistoryState] = useState<'open' | 'closed'>(
    items && items.length > 1 ? 'closed' : 'open',
  )

  if (!items || items.length === 0) return null

  const height = historyState === 'open' ? 'auto' : maxHistoryHeight

  return (
    <Box paddingTop={[2, 2, 5]}>
      <AnimateHeight height={height} duration={300}>
        <div ref={containerRef}>
          <HistoryStepper
            sections={items.map(
              ({ date, title, content, subjectAndActor }, index) => (
                <HistorySection
                  key={`history-section-${index}`}
                  section={title}
                  sectionIndex={index}
                  isComplete
                  theme={FormStepperThemes.PURPLE}
                  isLast={index + 1 === items.length}
                  date={date}
                  description={content}
                  subjectAndActor={subjectAndActor}
                />
              ),
            )}
          />
        </div>
      </AnimateHeight>
      {historyHeight > maxHistoryHeight && (
        <Box display="flex" justifyContent="flexEnd">
          <Box>
            <Button
              variant="text"
              onClick={() =>
                setHistoryState(historyState === 'open' ? 'closed' : 'open')
              }
              icon={historyState === 'open' ? 'arrowUp' : 'arrowDown'}
            >
              {historyState === 'open'
                ? formatMessage(coreMessages.closeApplicationHistoryLabel)
                : formatMessage(coreMessages.openApplicationHistoryLabel)}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
