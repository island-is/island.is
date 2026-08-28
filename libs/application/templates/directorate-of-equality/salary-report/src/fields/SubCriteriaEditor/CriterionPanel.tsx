import { AccordionCard, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { SubCriterionCatalogEntryDto } from '@island.is/clients/directorate-of-equality'
import { createDefaultSubCriterion } from '../../utils/constants'
import type { SubCriterion } from '../../utils/types'
import { messages } from '../../lib/messages'
import { SubCriterionItem } from './SubCriterionItem'

type Props = {
  criterionId: string
  accordionId: string
  criterionTitle: string
  criterionWeight: string
  catalogEntries: SubCriterionCatalogEntryDto[]
  startExpanded?: boolean
  /**
   * Reported upward rather than only rendered here: the parent disables "Halda
   * áfram" while ANY panel is out of balance, and deriving that at the top would
   * mean watching the whole form there — which re-renders every panel, and every
   * step textarea inside them, on each keystroke. The scoped useWatch below keeps
   * that work local; only a flip in the verdict travels up.
   */
  onWeightMismatchChange: (criterionId: string, hasMismatch: boolean) => void
}

export const CriterionPanel: FC<Props> = ({
  criterionId,
  accordionId,
  criterionTitle,
  criterionWeight,
  catalogEntries,
  startExpanded = false,
  onWeightMismatchChange,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: criterionId,
  })

  const watchedSubCriteria = useWatch({ name: criterionId }) as
    | SubCriterion[]
    | undefined
  const subCriteriaTotal = (watchedSubCriteria ?? []).reduce(
    (sum, sc) => sum + (Number(sc.weight) || 0),
    0,
  )
  const expectedWeight = Number(criterionWeight) || 0

  // Only meaningful once both sides exist: the parent criterion's own weight can
  // still be blank here (it's entered on the previous screen for personal
  // criteria), and `Number('') || 0` would otherwise make this claim the
  // sub-criteria must total 0%.
  const hasWeightMismatch =
    subCriteriaTotal !== 0 &&
    expectedWeight !== 0 &&
    Math.abs(subCriteriaTotal - expectedWeight) > 0.001

  useEffect(() => {
    onWeightMismatchChange(criterionId, hasWeightMismatch)
    // A panel that unmounts while unbalanced must not leave its id behind in the
    // parent: that would disable Continue with no visible error left to fix.
    return () => onWeightMismatchChange(criterionId, false)
  }, [criterionId, hasWeightMismatch, onWeightMismatchChange])

  return (
    <AccordionCard
      id={accordionId}
      label={criterionTitle}
      visibleContent={formatMessage(
        messages.report.subCriteria.criterionWeightLabel,
        {
          weight: criterionWeight,
        },
      )}
      startExpanded={startExpanded}
    >
      <Box>
        {fields.map((field, i) => (
          <SubCriterionItem
            key={field.id}
            fieldName={`${criterionId}.${i}`}
            index={i}
            isLast={i === fields.length - 1}
            canRemove={fields.length > 1}
            catalogEntries={catalogEntries}
            onRemove={() => remove(i)}
          />
        ))}
      </Box>

      <Box marginTop={4}>
        <Button
          size="small"
          variant="ghost"
          icon="add"
          onClick={() => append(createDefaultSubCriterion(criterionId))}
        >
          {formatMessage(messages.report.subCriteria.addButton)}
        </Button>
      </Box>

      {hasWeightMismatch && (
        <Box marginTop={3}>
          <Text color="red600">
            {formatMessage(messages.report.subCriteria.weightSumError, {
              total: subCriteriaTotal,
              expected: expectedWeight,
            })}
          </Text>
        </Box>
      )}
    </AccordionCard>
  )
}
