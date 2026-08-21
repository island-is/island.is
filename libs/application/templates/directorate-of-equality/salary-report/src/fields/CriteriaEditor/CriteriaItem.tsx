import { Box, Divider, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

type Props = {
  id: string
  title: string
  description: string
  weight: string
  onWeightChange: (weight: string) => void
  isLast: boolean
}

export const CriteriaItem = ({
  id,
  title,
  description,
  weight,
  onWeightChange,
  isLast,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingY={3}
      >
        <Box style={{ flex: 1 }}>
          <Text variant="h5">{title}</Text>
          <Text>{description}</Text>
        </Box>
        <Box style={{ width: 120, flexShrink: 0 }} marginLeft={3}>
          <Input
            size="sm"
            name={`criterion-${id}-weight`}
            label={`${formatMessage(messages.report.criteria.weightLabel)} (%)`}
            type="number"
            backgroundColor="blue"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
        </Box>
      </Box>
      {!isLast && <Divider />}
    </Box>
  )
}
