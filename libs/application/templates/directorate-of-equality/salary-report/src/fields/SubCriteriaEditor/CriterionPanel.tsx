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
  /**
   * The parent disables "Halda áfram" while ANY panel is unbalanced. Reported
   * upward rather than derived there, where watching the whole form would
   * re-render every panel and step textarea on each keystroke.
   */
  onWeightMismatchChange: (criterionId: string, hasMismatch: boolean) => void
}

export const CriterionPanel: FC<Props> = ({
  criterionId,
  accordionId,
  criterionTitle,
  criterionWeight,
  catalogEntries,
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

  // Compared to the PARENT's weight, 0% included: a 0%-weighted criterion whose
  // sub-criteria carry weight still writes real step scores below.
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
      // Every panel starts collapsed, so without a red header the gate above
      // could disable Continue with its explanation hidden inside the accordion.
      // The badge below carries the same signal in text — colour alone would
      // leave it unreadable to anyone who cannot see the difference.
      labelColor={hasWeightMismatch ? 'red600' : undefined}
      visibleContent={
        <>
          {formatMessage(messages.report.subCriteria.criterionWeightLabel, {
            weight: criterionWeight,
          })}
          {hasWeightMismatch && (
            <>
              {' — '}
              {formatMessage(
                messages.report.subCriteria.criterionWeightMismatchBadge,
              )}
            </>
          )}
        </>
      }
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
            message={formatMessage(messages.report.subCriteria.weightSumError, {
              total: subCriteriaTotal,
              expected: expectedWeight,
            })}
          />
        </Box>
      )}
    </AccordionCard>
  )
}
