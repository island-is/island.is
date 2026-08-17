import { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { YES } from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import type {
  SalaryAnalysisOutlierDto,
  ScoreBucketDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { OutlierEditor } from './OutlierEditor'

type Props = {
  application: Application
  outliers: SalaryAnalysisOutlierDto[]
  scoreBuckets: ScoreBucketDto[]
  // True on the POSTPONED-state review screen: the applicant already chose
  // to postpone earlier and can't un-postpone here, so the checkbox is
  // pointless — the form is dedicated to filling in the plan, and the
  // "postponed" answer is force-cleared so it stops being reported to the
  // backend as still postponed once this plan is submitted.
  hidePostponeCheckbox?: boolean
  errors?: RecordObject
}

// Rendered inline by SalaryAnalysisResults, sharing its already-fetched
// analysis result — this must NOT independently re-read
// application.externalData, since a sibling custom field reading that prop
// can be stale relative to the mutation response the parent just received.
export const OutlierGroupPanel: FC<Props> = ({
  application,
  outliers,
  scoreBuckets,
  hidePostponeCheckbox,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup
  const improvementPlanMessages = messages.salaryAnalysis.improvementPlan

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

  return (
    <Box marginTop={5}>
      <Text variant="h3" marginBottom={1}>
        {formatMessage(improvementPlanMessages.title)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(improvementPlanMessages.intro)}
      </Text>

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

      {!isPostponed && (
        <OutlierEditor
          application={application}
          outliers={outliers}
          scoreBuckets={scoreBuckets}
          errors={errors}
        />
      )}
    </Box>
  )
}
