import { InputController } from '@island.is/shared/form-fields'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { messages } from '../../lib/messages'
import type { SubCriterionStep } from '../../utils/types'

type Props = {
  fieldName: string
  index: number
  isLast: boolean
  canRemove: boolean
  onRemove: () => void
}

export const SubCriterionItem: FC<Props> = ({
  fieldName,
  isLast,
  canRemove,
  onRemove,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [stepsExpanded, setStepsExpanded] = useState(true)

  const stepCountStr: string =
    useWatch({ name: `${fieldName}.stepCount` }) ?? '2'
  const steps: SubCriterionStep[] =
    useWatch({ name: `${fieldName}.steps` }) ?? []

  useEffect(() => {
    const count = Math.min(8, Math.max(2, Number(stepCountStr) || 2))
    const currentSteps: SubCriterionStep[] =
      getValues(`${fieldName}.steps`) ?? []
    if (count === currentSteps.length) return

    if (count > currentSteps.length) {
      const extra = Array.from({ length: count - currentSteps.length }, () => ({
        description: '',
      }))
      setValue(`${fieldName}.steps`, [...currentSteps, ...extra])
    } else {
      setValue(`${fieldName}.steps`, currentSteps.slice(0, count))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCountStr])

  return (
    <Box>
      {/* Header row: name input + delete */}
      <Box display="flex" columnGap={2} alignItems="flexEnd" marginBottom={2}>
        <Box style={{ flex: 1 }}>
          <InputController
            size="sm"
            id={`${fieldName}.title`}
            name={`${fieldName}.title`}
            label={formatMessage(messages.report.subCriteria.nameLabel)}
            backgroundColor="blue"
          />
        </Box>
        {canRemove && (
          <Button
            size="small"
            variant="ghost"
            icon="trash"
            iconType="outline"
            onClick={onRemove}
          >
            {formatMessage(messages.report.subCriteria.deleteButton)}
          </Button>
        )}
      </Box>

      {/* Definition */}
      <Box marginBottom={2}>
        <InputController
          size="sm"
          id={`${fieldName}.description`}
          name={`${fieldName}.description`}
          label={formatMessage(messages.report.subCriteria.definitionLabel)}
          textarea
          backgroundColor="blue"
        />
      </Box>

      {/* Weight + step count */}
      <Box display="flex" columnGap={2} marginBottom={3}>
        <Box style={{ flex: 1 }}>
          <InputController
            size="sm"
            id={`${fieldName}.weight`}
            name={`${fieldName}.weight`}
            label={formatMessage(messages.report.subCriteria.weightLabel)}
            type="number"
            suffix="%"
            backgroundColor="blue"
          />
        </Box>
        <Box style={{ flex: 1 }}>
          <InputController
            size="sm"
            id={`${fieldName}.stepCount`}
            name={`${fieldName}.stepCount`}
            label={formatMessage(messages.report.subCriteria.stepCountLabel)}
            type="number"
            backgroundColor="blue"
          />
        </Box>
      </Box>

      {/* Steps section */}
      <Box
        display="flex"
        alignItems="center"
        columnGap={1}
        marginBottom={2}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setStepsExpanded((v) => !v)}
      >
        <Text variant="h5">
          {formatMessage(messages.report.subCriteria.stepsLabel)}
        </Text>
        <Text color="blue400">{stepsExpanded ? '–' : '+'}</Text>
      </Box>

      {stepsExpanded && (
        <Box marginBottom={4}>
          {steps.map((_, stepIndex) => (
            <Box key={stepIndex} marginBottom={2}>
              <InputController
                size="sm"
                id={`${fieldName}.steps.${stepIndex}.description`}
                name={`${fieldName}.steps.${stepIndex}.description`}
                label={formatMessage(messages.report.subCriteria.stepLabel, {
                  index: stepIndex + 1,
                })}
                textarea
                backgroundColor="blue"
              />
            </Box>
          ))}
        </Box>
      )}

      {!isLast && (
        <Box marginTop={4}>
          <Divider />
        </Box>
      )}
    </Box>
  )
}
