import { FC, useEffect } from 'react'
import {
  FormProvider,
  useFormContext,
  useWatch,
  UseFormReturn,
} from 'react-hook-form'
import { YES } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { OutlierEditor } from './OutlierEditor'

type Props = {
  outliers: SalaryAnalysisOutlierDto[]
  // True on the POSTPONED-state review screen: the applicant already chose
  // to postpone earlier and can't un-postpone here, so the checkbox is
  // pointless — the form is dedicated to filling in the plan, and the
  // "postponed" answer is force-cleared so it stops being reported to the
  // backend as still postponed once this plan is submitted. Also doubles as
  // the persistence-mode signal for OutlierEditor's `mode` prop.
  hidePostponeCheckbox?: boolean
  errors?: RecordObject
  // Draft phase only: local form scope for outlierGroups (not answers-backed pre-submit); the postponed checkbox stays on the ambient form regardless.
  outlierGroupsFormMethods?: UseFormReturn<{
    salaryAnalysis: { outlierGroups: OutlierGroupAnswer[] }
  }>
  onSaveGroups: (groups: OutlierGroupAnswer[]) => Promise<boolean>
  initialSavedGroups: OutlierGroupAnswer[]
}

export const OutlierGroupPanel: FC<Props> = ({
  outliers,
  hidePostponeCheckbox,
  errors,
  outlierGroupsFormMethods,
  onSaveGroups,
  initialSavedGroups,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup

  const postponed: string[] =
    useWatch({ name: 'salaryAnalysis.postponed' }) ?? []
  const isPostponed = postponed.includes(YES)

  useEffect(() => {
    if (hidePostponeCheckbox && postponed.length > 0) {
      setValue('salaryAnalysis.postponed', [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidePostponeCheckbox])

  if (outliers.length === 0) return null

  // One element, two scopes: draft phase wraps it in the local form, the review
  // states leave it on the ambient one.
  const editor = (
    <OutlierEditor
      outliers={outliers}
      errors={errors}
      mode={hidePostponeCheckbox ? 'postponed' : 'draft'}
      onSaveGroups={onSaveGroups}
      initialSavedGroups={initialSavedGroups}
    />
  )

  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd" marginBottom={4}>
        <a
          href={formatMessage(m.instructionsLink)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="utility" icon="open" iconType="outline" as="span">
            {formatMessage(m.instructionsLabel)}
          </Button>
        </a>
      </Box>
      {!hidePostponeCheckbox && (
        <Box
          background="blue100"
          borderRadius="large"
          padding={4}
          marginBottom={4}
        >
          <Text variant="h4" marginBottom={1}>
            {formatMessage(m.postponeCardTitle)}
          </Text>
          <Text marginBottom={2}>
            {formatMessage(m.postponeCardDescription)}
          </Text>
          <CheckboxController
            id="salaryAnalysis.postponed"
            name="salaryAnalysis.postponed"
            options={[
              { label: formatMessage(m.postponeCheckboxLabel), value: YES },
            ]}
          />
        </Box>
      )}

      {!isPostponed &&
        (outlierGroupsFormMethods ? (
          <FormProvider {...outlierGroupsFormMethods}>{editor}</FormProvider>
        ) : (
          editor
        ))}
    </Box>
  )
}
