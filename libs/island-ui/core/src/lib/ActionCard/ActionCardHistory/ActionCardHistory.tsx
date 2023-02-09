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

interface Props {
  history: ActionCardHistoryConfig
}

const MAX_HISTORY_HEIGHT = 200

export const ActionCardHistory = ({ history }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { height: historyHeight } = useComponentSize(containerRef)
  const [historyState, setHistoryState] = useState<'open' | 'closed'>(
    history?.items && history.items.length > 1 ? 'closed' : 'open',
  )

  if (!history.items) return null

  const height =
    history.items.length < 3
      ? 'auto'
      : historyState === 'open'
      ? 'auto'
      : MAX_HISTORY_HEIGHT

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
      {history.items.length > 2 && historyHeight > MAX_HISTORY_HEIGHT && (
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
