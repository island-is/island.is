import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
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

type Props = {
  application: Application
}

export const PersonalCriteriaList = ({ application }: Props) => {
  const { formatMessage, lang: locale } = useLocale()
  const { control, getValues, setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [saveError, setSaveError] = useState<{
    deletedTitle: string
  } | null>(null)

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
  // criteria to their step assignments.
  //
  // This screen's own "Continue" only persists the `criteria` answer key, so
  // a plain setValue here would leave the correction stuck in local form
  // state until the (much later) Employees screen is submitted — a reload in
  // between would resurrect the stale assignment from the backend. Persist
  // it immediately instead, mirroring ExcelTemplateDownload's pattern.
  const removeFromEmployees = async (deletedTitle: string) => {
    if (!deletedTitle) return
    const employees =
      (getValues('employees') as Employee[] | undefined) ?? []
    if (employees.length === 0) return
    const filtered = employees.map((emp) => ({
      ...emp,
      personalStepAssignments: (emp.personalStepAssignments ?? []).filter(
        (a) => a.criterionTitle !== deletedTitle,
      ),
    }))
    setValue('employees', filtered)
    try {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: { employees: filtered },
          },
          locale,
        },
      })
      setSaveError(null)
    } catch {
      // The local form state above is already corrected, but the backend
      // isn't — a reload before the Employees screen is reached would
      // resurrect the stale assignment. Surface this so the user can retry
      // rather than unknowingly relying on an unsaved local-only fix.
      setSaveError({ deletedTitle })
    }
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
              onClick={() => void removeFromEmployees(saveError.deletedTitle)}
            >
              {formatMessage(messages.report.criteria.retryButton)}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
