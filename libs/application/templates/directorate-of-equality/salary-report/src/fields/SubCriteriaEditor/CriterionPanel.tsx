import {
  AccordionCard,
  AlertMessage,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
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
}

export const CriterionPanel: FC<Props> = ({
  criterionId,
  accordionId,
  criterionTitle,
  criterionWeight,
  catalogEntries,
  startExpanded = false,
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

      {/* Only meaningful once both sides exist: the parent criterion's own
          weight can still be blank here (it's entered on the previous screen
          for personal criteria), and `Number('') || 0` would otherwise make
          this claim the sub-criteria must total 0%. */}
      {subCriteriaTotal !== 0 &&
        expectedWeight !== 0 &&
        Math.abs(subCriteriaTotal - expectedWeight) > 0.001 && (
          <Box marginTop={3}>
            <AlertMessage
              type="error"
              title={formatMessage(messages.errors.alertTitle)}
              message={formatMessage(
                messages.report.subCriteria.weightSumError,
                {
                  total: subCriteriaTotal,
                  expected: expectedWeight,
                },
              )}
            />
          </Box>
        )}
    </AccordionCard>
  )
}
