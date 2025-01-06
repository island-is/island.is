import { Box, Text, Tooltip } from '@island.is/island-ui/core'

type Props = {
  sectionLabel?: string
  tooltipText?: string
  children: React.ReactNode
  noBorder?: boolean
}

export const SummarySection = ({
  sectionLabel,
  tooltipText,
  children,
  noBorder = false,
}: Props) => {
  return (
    <Box marginTop={3}>
      {sectionLabel && (
        <Text variant="h5" as="h3">
          {sectionLabel} {tooltipText && <Tooltip text={tooltipText} />}
        </Text>
      )}
      <Box
        marginTop={1}
        paddingX={noBorder ? 0 : 4}
        paddingY={noBorder ? 0 : 2}
        border={noBorder ? 'disabled' : 'standard'}
        borderColor="blue200"
        borderRadius="large"
      >
        {children}
      </Box>
    </Box>
  )
}
