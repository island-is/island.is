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

  // Guarded on the PARENT's weight only.
  //
  // There is deliberately no `subCriteriaTotal !== 0` term. That was harmless
  // while this only suppressed a red message, but it is now what decides whether
  // Continue is enabled — and `createDefaultSubCriterion` seeds `weight: ''`, so
  // a criterion nobody has filled in yet totals 0 and would have sailed straight
  // through the gate. "Expected 40%, entered nothing" is exactly the mismatch
  // this is here to catch: on Continue it writes weight 0, which makes maxScore
  // and every step score 0 — an unscoreable yfirviðmið.
  //
  // `expectedWeight !== 0` stays, because a parent that has not been weighted yet
  // (personal criteria are weighted on the previous screen) must not have this
  // panel demanding its sub-criteria total 0%. Note this cannot be tightened to a
  // blank-string check: `criterionWeight` arrives as `String(criterion.weight)`
  // from a required `number`, so it is never '' — "0" is how "not weighted yet"
  // reaches us.
  const hasWeightMismatch =
    expectedWeight !== 0 && Math.abs(subCriteriaTotal - expectedWeight) > 0.001

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
      // Reddens the header so an out-of-balance criterion is identifiable while
      // COLLAPSED. Only the first panel of each group starts expanded, so without
      // this the gate above could disable Continue with its own explanation
      // hidden inside a shut accordion — a dead button with no visible cause.
      labelColor={hasWeightMismatch ? 'red600' : undefined}
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
