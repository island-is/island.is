import {
  AccordionCard,
  AlertMessage,
  Box,
  Button,
} from '@island.is/island-ui/core'
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

  // Compare to the PARENT's weight, including 0%. A 0%-weighted criterion can
  // only carry 0% worth of sub-criteria; otherwise those sub-criteria still write
  // real step scores below even though the parent contributes no weight.
  const hasWeightMismatch = Math.abs(subCriteriaTotal - expectedWeight) > 0.001

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
           <AlertMessage
              type="error"
              title={formatMessage(messages.errors.alertTitle)}
              message={
              formatMessage(messages.report.subCriteria.weightSumError, {
              total: subCriteriaTotal,
              expected: expectedWeight,
            })}
            />
        </Box>
      )}
    </AccordionCard>
  )
}
