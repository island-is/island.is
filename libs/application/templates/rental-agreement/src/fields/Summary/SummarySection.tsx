import { Text, Tooltip } from '@island.is/island-ui/core'
import { Box } from 'reakit'
import { summarySection } from './summaryStyles.css'

type Props = {
  sectionLabel?: string
  tooltipText?: string
  children: React.ReactNode
}

export const SummarySection = ({
  sectionLabel,
  tooltipText,
  children,
}: Props) => {
  return (
    <>
      {sectionLabel && (
        <>
          <Text variant="h5" as="h3">
            {sectionLabel}
          </Text>
          {tooltipText && <Tooltip text={tooltipText} />}
        </>
      )}
      <Box className={summarySection}>{children}</Box>
    </>
  )
}
