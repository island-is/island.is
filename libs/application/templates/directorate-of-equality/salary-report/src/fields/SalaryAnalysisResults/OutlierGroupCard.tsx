import { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { AccordionCard, Box, Button, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type {
  GroupDirection,
  OutlierGroupAnswer,
} from '../../utils/outlierGroups'

type Props = {
  fieldId: string
  fieldName: string
  index: number
  group: OutlierGroupAnswer
  // Live value of group.name, sourced from useWatch rather than useFieldArray's
  // fields (which only updates on structural changes) so the header updates as
  // the user types instead of only after an append/remove.
  liveName?: string
  direction: GroupDirection
  mode: 'draft' | 'postponed'
  errors?: RecordObject
  onRemove: () => void
}

// One accordion card per outlier group, split out of OutlierEditor.
export const OutlierGroupCard: FC<Props> = ({
  fieldId,
  fieldName,
  index,
  group,
  liveName,
  direction,
  mode,
  errors,
  onRemove,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.outlierGroup

  // Below and above are different questions, so they get different prompts.
  // A group can hold both — the applicant composes groups freely — which is
  // what 'mixed' is for; it is a real third case, not a fallback.
  const prompt = {
    below: m.groupPromptBelow,
    above: m.groupPromptAbove,
    mixed: m.groupPromptMixed,
    onLine: m.groupPromptNeutral,
  }[direction]

  const groupError = (suffix: string) =>
    mode === 'postponed' && errors
      ? getErrorViaPath(errors, `${fieldName}.${index}.${suffix}`)
      : undefined

  return (
    <Box marginBottom={3}>
      <AccordionCard
        id={fieldId}
        label={liveName || `${formatMessage(m.groupHeading)} ${index + 1}`}
        visibleContent={`${formatMessage(
          m.groupMembers,
        )}: ${group.employeeOrdinals.join(', ')}`}
        startExpanded
      >
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button variant="text" size="small" onClick={onRemove}>
            {formatMessage(m.removeGroupButton)}
          </Button>
        </Box>
        <Box marginBottom={2}>
          <Text variant="small">{formatMessage(prompt)}</Text>
        </Box>
        <InputController
          id={`${fieldName}.${index}.name`}
          name={`${fieldName}.${index}.name`}
          label={formatMessage(m.nameLabel)}
          backgroundColor="blue"
          error={groupError('name')}
        />
        <Box marginTop={2}>
          <InputController
            id={`${fieldName}.${index}.reason`}
            name={`${fieldName}.${index}.reason`}
            label={formatMessage(m.reasonLabel)}
            required
            textarea
            backgroundColor="blue"
            error={groupError('reason')}
          />
        </Box>
        <Box marginTop={2}>
          <InputController
            id={`${fieldName}.${index}.action`}
            name={`${fieldName}.${index}.action`}
            label={formatMessage(m.actionLabel)}
            required
            textarea
            backgroundColor="blue"
            error={groupError('action')}
          />
        </Box>
        <Box marginTop={2} display="flex" columnGap={2}>
          <Box style={{ flex: 1 }}>
            <InputController
              id={`${fieldName}.${index}.signatureName`}
              name={`${fieldName}.${index}.signatureName`}
              label={formatMessage(m.signatureNameLabel)}
              backgroundColor="blue"
              error={groupError('signatureName')}
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <InputController
              id={`${fieldName}.${index}.signatureRole`}
              name={`${fieldName}.${index}.signatureRole`}
              label={formatMessage(m.signatureRoleLabel)}
              required
              backgroundColor="blue"
              error={groupError('signatureRole')}
            />
          </Box>
        </Box>
      </AccordionCard>
    </Box>
  )
}
