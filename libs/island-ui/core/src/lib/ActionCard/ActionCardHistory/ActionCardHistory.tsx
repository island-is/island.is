import useComponentSize from '@rehooks/component-size'
import React, { useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import HistorySection from '../../FormStepper/HistorySection'
import HistoryStepper from '../../FormStepper/HistoryStepper'
import { FormStepperThemes } from '../../FormStepper/types'

export type ActionCardHistoryConfig = {
  openButtonLabel: string
  closeButtonLabel: string
  items?: {
    date?: string
    title: string
    content?: React.ReactNode
  }[]
}

type ActionCardHistorySize = 'sm' | 'lg'

interface Props {
  history: ActionCardHistoryConfig
  size?: ActionCardHistorySize
}

const sizeMapper: Record<ActionCardHistorySize, number> = {
  sm: 144,
  lg: 216,
}

export const ActionCardHistory = ({ history, size = 'sm' }: Props) => {
  const maxHistoryHeight = sizeMapper[size]
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: historyHeight } = useComponentSize(containerRef)
  const [historyState, setHistoryState] = useState<'open' | 'closed'>(
    history?.items && history.items.length > 1 ? 'closed' : 'open',
  )

  if (!history.items) return null

  const height = historyState === 'open' ? 'auto' : maxHistoryHeight

  return (
    <Box paddingTop={[2, 2, 5]}>
      <AnimateHeight height={height} duration={300}>
        <div ref={containerRef}>
          <HistoryStepper
            sections={history.items.map(({ date, title, content }, index) => (
              <HistorySection
                key={`history-section-${index}`}
                section={title}
                sectionIndex={index}
                isComplete
                theme={FormStepperThemes.PURPLE}
                isLast={index + 1 === history?.items?.length}
                date={date}
                description={content}
              />
            ))}
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
                ? history.closeButtonLabel
                : history.openButtonLabel}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
