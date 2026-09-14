import { FC, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import {
  AccordionCard,
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import type { Locale } from '@island.is/shared/types'
import { messages } from '../../lib/messages'
import { isRemedyDateInWindow, remedyDateBounds } from '../../utils/dates'
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
  const { formatMessage, lang } = useLocale()
  const m = messages.salaryAnalysis.outlierGroup

  // DMR rejects a remedy date outside this window, so the calendar doesn't offer
  // one. Bounds and the error below come from the same helper, so the calendar
  // cannot offer a date the Continue and submit gates would then refuse.
  // Computed once — the card re-renders on every keystroke in it, and a fresh
  // Date each time would churn react-datepicker's own props.
  const { min: minRemedyDate, max: maxRemedyDate } = useMemo(
    () => remedyDateBounds(new Date()),
    [],
  )

  // Watched rather than taken from the `errors` prop: a date that has gone stale
  // since it was picked has to surface in draft mode too, and there the groups
  // live on the DMR draft and never reach dataSchema — groupError is undefined
  // in that mode by design.
  const remedyDate = useWatch({
    name: `${fieldName}.${index}.remedyDate`,
  }) as string | undefined

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

  // Only once something is picked: an untouched field is errors.required's
  // business, and dataSchema reports the two as separate issues for that reason.
  const remedyDateError =
    remedyDate && !isRemedyDateInWindow(remedyDate, new Date())
      ? formatMessage(messages.errors.remedyDateOutOfRange)
      : groupError('remedyDate')

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
        {/* The bound belongs beside the field rather than under it: a date
            field stretched across the whole card reads as a longer answer than
            it takes, and the half it doesn't need is where the rule goes. Both
            halves fall back to full width on a phone, where the hint stacks
            underneath. */}
        <GridRow marginTop={2}>
          <GridColumn span={['12/12', '6/12']}>
            {/* DatePickerController takes no RHF `rules` and its `required` is
                label-only, so what actually holds a bad date back is
                isOutlierGroupSubmittable (the Continue gate, in both modes) and
                dataSchema's superRefine — plus remedyDateError above, which is
                the only one of the three that reports on the field in draft
                mode. */}
            <DatePickerController
              id={`${fieldName}.${index}.remedyDate`}
              name={`${fieldName}.${index}.remedyDate`}
              label={formatMessage(m.remedyDateLabel)}
              locale={lang as Locale}
              minDate={minRemedyDate}
              maxDate={maxRemedyDate}
              required
              backgroundColor="blue"
              error={remedyDateError}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']} paddingTop={[1, 0]}>
            {/* Centred over the column rather than pinned to its top: the
                picker's own label sits above its input, so aligning the hint
                with the top of the row would leave it floating above the field
                it describes. */}
            <Box height="full" display="flex" alignItems="center">
              <Text variant="small" color="dark400">
                {formatMessage(m.remedyDateDescription)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
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
