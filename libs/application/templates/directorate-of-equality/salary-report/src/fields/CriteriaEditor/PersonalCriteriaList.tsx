import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import type { Application } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Text,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { Employee, SubCriterion } from '../../utils/types'
import { useCascadeDelete } from '../../utils/useCascadeDelete'

type Props = {
  application: Application
}

export const PersonalCriteriaList = ({ application }: Props) => {
  const { formatMessage } = useLocale()
  const { control, getValues } = useFormContext()
  const { persist, retry, saveError } = useCascadeDelete(application)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria.personalFactors',
  })

  // Deleting a criterion has to cascade into two other answer keys, neither of
  // which this screen's own "Continue" saves — so both go out here in a single
  // mutation rather than sitting in local form state until some later,
  // unrelated screen is submitted:
  //
  // - `subCriteria.personalFactors` is position-indexed parallel to
  //   `criteria.personalFactors` (no shared id), so the matching slot must be
  //   spliced out or a later-added criterion inherits the deleted one's
  //   leftover sub-criteria at that index.
  // - `employees` keep `personalStepAssignments` matched by criterion title,
  //   which would otherwise be stale and unreachable.
  //
  // Written through the whole `subCriteria` object, not the nested path:
  // updateApplication merges answers only one level deep.
  const cascadeDelete = (index: number, deletedTitle: string) => {
    const subCriteria = getValues('subCriteria') as
      | { jobFactors?: SubCriterion[][]; personalFactors?: SubCriterion[][] }
      | undefined
    const personalFactors = [...(subCriteria?.personalFactors ?? [])]
    personalFactors.splice(index, 1)

    const employees = (getValues('employees') as Employee[] | undefined) ?? []

    return persist(deletedTitle, {
      subCriteria: { ...subCriteria, personalFactors },
      employees: employees.map((emp) => ({
        ...emp,
        personalStepAssignments: (emp.personalStepAssignments ?? []).filter(
          (a) => a.criterionTitle !== deletedTitle,
        ),
      })),
    })
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
                onClick={() => {
                  const deletedTitle = getValues(
                    `criteria.personalFactors.${i}.title`,
                  ) as string
                  remove(i)
                  void cascadeDelete(i, deletedTitle)
                }}
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

      {saveError && (
        <Box marginTop={3}>
          <AlertMessage
            type="error"
            message={formatMessage(messages.report.criteria.deleteSaveError)}
          />
          <Box marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="reload"
              onClick={() => void retry()}
            >
              {formatMessage(messages.report.criteria.retryButton)}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
