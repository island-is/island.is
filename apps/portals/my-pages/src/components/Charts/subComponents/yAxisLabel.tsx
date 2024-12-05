import { Text, Box } from '@island.is/island-ui/core'

interface YAxisLabelProps {
  label?: string
  labelRight?: string
  rightPadding?: number
}
export const YAxisLabel = ({
  label,
  labelRight,
  rightPadding = 0,
}: YAxisLabelProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      style={{ paddingRight: rightPadding }}
    >
      {label && <Text variant="eyebrow">{label}</Text>}
      {labelRight && <Text variant="eyebrow">{labelRight}</Text>}
    </Box>
  )
}
