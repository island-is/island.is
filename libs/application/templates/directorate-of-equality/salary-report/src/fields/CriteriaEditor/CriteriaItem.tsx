import { InputController } from '@island.is/shared/form-fields'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

type Props = {
  title: string
  description: string
  index: number
  isLast: boolean
}

export const CriteriaItem = ({ title, description, index, isLast }: Props) => {
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
          <InputController
            size="sm"
            id={`criteria.jobFactors.${index}.weight`}
            name={`criteria.jobFactors.${index}.weight`}
            label={formatMessage(messages.report.criteria.weightLabel)}
            type="number"
            suffix="%"
            backgroundColor="blue"
          />
        </Box>
      </Box>
      {!isLast && <Divider />}
    </Box>
  )
}
