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
  const { control, getValues, setValue } = useFormContext()
  const { persist, saveError } = useCascadeDelete<Employee>(
    application,
    'employees',
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria.personalFactors',
  })

  // subCriteria.personalFactors is kept parallel/position-indexed with
  // criteria.personalFactors (no shared id), so deleting a criterion must also
  // drop its sub-criteria slot or a later-added criterion inherits the
  // deleted one's leftover sub-criteria data at that index. Spliced directly
  // via getValues/setValue rather than useFieldArray — each element here is
  // itself an array (SubCriterion[][]), not an object, which useFieldArray's
  // id-tracking isn't designed for.
  const removeSubCriteria = (index: number) => {
    const current =
      (getValues('subCriteria.personalFactors') as
        | SubCriterion[][]
        | undefined) ?? []
    const next = [...current]
    next.splice(index, 1)
    setValue('subCriteria.personalFactors', next)
  }

  // A deleted criterion's already-assigned steps (from the "Mat á
  // einstaklingsbundnum þáttum" screen) must be dropped too, or every
  // employee keeps a stale, unreachable assignment for a criterion that no
  // longer exists. Matched by title, same as the rest of this template links
  // criteria to their step assignments. useCascadeDelete persists the
  // correction immediately, since this screen's own "Continue" only saves
  // the `criteria` answer key.
  const removeFromEmployees = (deletedTitle: string) =>
    persist(deletedTitle, (employees) =>
      employees.map((emp) => ({
        ...emp,
        personalStepAssignments: (emp.personalStepAssignments ?? []).filter(
          (a) => a.criterionTitle !== deletedTitle,
        ),
      })),
    )

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
                  removeSubCriteria(i)
                  void removeFromEmployees(deletedTitle)
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
              onClick={() => void removeFromEmployees(saveError)}
            >
              {formatMessage(messages.report.criteria.retryButton)}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
