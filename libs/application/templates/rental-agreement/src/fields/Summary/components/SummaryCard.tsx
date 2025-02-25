import { Box, Text, Tooltip } from '@island.is/island-ui/core'

type Props = {
  cardLabel?: string
  tooltipText?: string
  children: React.ReactNode
}

export const SummaryCard = ({ cardLabel, tooltipText, children }: Props) => {
  return (
    <Box marginTop={3}>
      {cardLabel && (
        <Text variant="h5" as="h3">
          {cardLabel} {tooltipText && <Tooltip text={tooltipText} />}
        </Text>
      )}
      {children}
    </Box>
  )
}
