import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { Box, Button, Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

export const PersonalCriteriaList = () => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria.personalFactors',
  })

  return (
    <Box marginTop={6}>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(messages.report.criteria.personalFactorTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.report.criteria.personalFactorIntro)}
      </Text>

      <Stack space={4} dividers={true}>
        {fields.map((field, i) => (
          <Box key={field.id} borderRadius="large">
            <Box
              display="flex"
              columnGap={2}
              alignItems="flexEnd"
              marginBottom={2}
            >
              <Box style={{ flex: 1 }}>
                <InputController
                  size="sm"
                  id={`criteria.personalFactors.${i}.title`}
                  name={`criteria.personalFactors.${i}.title`}
                  label={formatMessage(
                    messages.report.criteria.criterionNameLabel,
                  )}
                  backgroundColor="blue"
                />
              </Box>
              <Box style={{ width: 120, flexShrink: 0 }}>
                <InputController
                  size="sm"
                  id={`criteria.personalFactors.${i}.weight`}
                  name={`criteria.personalFactors.${i}.weight`}
                  label={formatMessage(messages.report.criteria.weightLabel)}
                  type="number"
                  suffix="%"
                  backgroundColor="blue"
                />
              </Box>
              <Button
                size="default"
                variant="ghost"
                icon="trash"
                iconType="outline"
                onClick={() => remove(i)}
              >
                {formatMessage(messages.report.criteria.deleteButton)}
              </Button>
            </Box>
            <InputController
              size="sm"
              id={`criteria.personalFactors.${i}.description`}
              name={`criteria.personalFactors.${i}.description`}
              label={formatMessage(messages.report.criteria.descriptionLabel)}
              textarea
              backgroundColor="blue"
            />
          </Box>
        ))}
      </Stack>

      <Box marginTop={4}>
        <Button
          size="small"
          variant="ghost"
          icon="add"
          onClick={() => append({ title: '', description: '', weight: '' })}
        >
          {formatMessage(messages.report.criteria.addCriterionButton)}
        </Button>
      </Box>
    </Box>
  )
}
