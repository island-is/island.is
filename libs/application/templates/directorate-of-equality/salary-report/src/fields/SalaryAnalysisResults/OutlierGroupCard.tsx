import { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import {
  AccordionCard,
  Box,
  Button,
  Icon,
  Tag,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { GroupDirection } from '../../utils/outlierGroups'

type Props = {
  fieldId: string
  fieldName: string
  index: number
  // Live value of group.name, sourced from useWatch rather than useFieldArray's
  // fields (which only updates on structural changes) so the header updates as
  // the user types instead of only after an append/remove.
  liveName?: string
  // Live member ordinals, sourced from useWatch for the same reason as
  // liveName: taking a member out of the group is a setValue, not a field-array
  // mutation, so `group.employeeOrdinals` would keep showing the old set.
  memberOrdinals: number[]
  direction: GroupDirection
  mode: 'draft' | 'postponed'
  errors?: RecordObject
  onRemove: () => void
  onRemoveMember: (ordinal: number) => void
}

// One accordion card per outlier group, split out of OutlierEditor.
export const OutlierGroupCard: FC<Props> = ({
  fieldId,
  fieldName,
  index,
  liveName,
  memberOrdinals,
  direction,
  mode,
  errors,
  onRemove,
  onRemoveMember,
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
        visibleContent={`${formatMessage(m.groupMemberCount)}: ${
          memberOrdinals.length
        }`}
        startExpanded
      >
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button variant="text" size="small" onClick={onRemove}>
            {formatMessage(m.removeGroupButton)}
          </Button>
        </Box>
        {memberOrdinals.length > 0 && (
          <Box marginBottom={4}>
            {/* Label and pills share one wrapping flex row, so the pills carry
                on beside the label rather than under a heading of their own. */}
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              rowGap={1}
              columnGap={1}
            >
              <Text variant="small">
                {`${formatMessage(m.groupMembersLabel)}:`}
              </Text>
              {memberOrdinals.map((ordinal) => (
                <Tag
                  key={ordinal}
                  variant="blueberry"
                  // Without this, Tag paints a mint ground on :focus, which a
                  // pointer click triggers — keyboard focus still gets it.
                  focusVisibleOnly
                  onClick={() => onRemoveMember(ordinal)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    columnGap="smallGutter"
                  >
                    {`#${ordinal}`}
                    {/* Always rendered rather than revealed on hover: the pill
                        is a remove control, and a hover-only affordance never
                        appears on touch at all. */}
                    <Box
                      component="span"
                      display="inlineFlex"
                      alignItems="center"
                    >
                      <Icon icon="close" size="small" ariaHidden />
                    </Box>
                    {/* TagProps takes no aria-label, so the button's purpose
                        rides along inside its label instead. */}
                    <VisuallyHidden>
                      {formatMessage(m.removeMemberLabel, {
                        employee: ordinal,
                      })}
                    </VisuallyHidden>
                  </Box>
                </Tag>
              ))}
            </Box>
          </Box>
        )}
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
