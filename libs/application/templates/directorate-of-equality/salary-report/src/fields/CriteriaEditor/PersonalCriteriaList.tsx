import { Box, Button, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { PersonalFactor } from '../../utils/types'

type Props = {
  personalFactors: PersonalFactor[]
  onChange: (factors: PersonalFactor[]) => void
  onRemove: (id: string) => void
}

export const PersonalCriteriaList = ({
  personalFactors,
  onChange,
  onRemove,
}: Props) => {
  const { formatMessage } = useLocale()

  const updateFactor = (id: string, patch: Partial<PersonalFactor>) => {
    onChange(personalFactors.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const addFactor = () => {
    onChange([
      ...personalFactors,
      { id: crypto.randomUUID(), title: '', description: '', weight: '' },
    ])
  }

  return (
    <Box marginTop={6}>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(messages.report.criteria.personalFactorTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.report.criteria.personalFactorIntro)}
      </Text>

      <Stack space={4} dividers={true}>
        {personalFactors.map((factor) => (
          <Box key={factor.id} borderRadius="large">
            <Box
              display="flex"
              columnGap={2}
              alignItems="flexEnd"
              marginBottom={2}
            >
              <Box style={{ flex: 1 }}>
                <Input
                  size="sm"
                  name={`personalFactor-${factor.id}-title`}
                  label={formatMessage(
                    messages.report.criteria.criterionNameLabel,
                  )}
                  backgroundColor="blue"
                  value={factor.title}
                  onChange={(e) =>
                    updateFactor(factor.id, { title: e.target.value })
                  }
                />
              </Box>
              <Box style={{ width: 120, flexShrink: 0 }}>
                <Input
                  size="sm"
                  name={`personalFactor-${factor.id}-weight`}
                  label={`${formatMessage(
                    messages.report.criteria.weightLabel,
                  )} (%)`}
                  type="number"
                  backgroundColor="blue"
                  value={factor.weight}
                  onChange={(e) =>
                    updateFactor(factor.id, { weight: e.target.value })
                  }
                />
              </Box>
              <Button
                size="default"
                variant="ghost"
                icon="trash"
                iconType="outline"
                onClick={() => onRemove(factor.id)}
              >
                {formatMessage(messages.report.criteria.deleteButton)}
              </Button>
            </Box>
            <Input
              size="sm"
              name={`personalFactor-${factor.id}-description`}
              label={formatMessage(messages.report.criteria.descriptionLabel)}
              textarea
              backgroundColor="blue"
              value={factor.description ?? ''}
              onChange={(e) =>
                updateFactor(factor.id, { description: e.target.value })
              }
            />
          </Box>
        ))}
      </Stack>

      <Box marginTop={4}>
        <Button size="small" variant="ghost" icon="add" onClick={addFactor}>
          {formatMessage(messages.report.criteria.addCriterionButton)}
        </Button>
      </Box>
    </Box>
  )
}
