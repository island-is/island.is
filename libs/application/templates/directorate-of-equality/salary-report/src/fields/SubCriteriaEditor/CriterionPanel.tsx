import { AccordionCard, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ParsedSubCriterionDto } from '@island.is/clients/directorate-of-equality'
import { DEFAULT_SUB_CRITERION } from '../../utils/constants'
import type { SubCriterion } from '../../utils/types'
import { messages } from '../../lib/messages'
import { SubCriterionItem } from './SubCriterionItem'

type Props = {
  accordionId: string
  criterionTitle: string
  criterionWeight: string
  fieldName: string
  startExpanded?: boolean
  savedSubCriteria: SubCriterion[]
  parsedSubCriteria: ParsedSubCriterionDto[]
  parsedSalaryReportDate: string | undefined
}

const mapParsedToSubCriteria = (
  parsed: ParsedSubCriterionDto[],
): SubCriterion[] =>
  parsed.map((sc) => ({
    title: sc.title,
    description: sc.description,
    weight: String(sc.weight),
    stepCount: String(sc.steps.length),
    steps: sc.steps.map((s) => ({ description: s.description })),
  }))

export const CriterionPanel: FC<Props> = ({
  accordionId,
  criterionTitle,
  criterionWeight,
  fieldName,
  savedSubCriteria,
  parsedSubCriteria,
  parsedSalaryReportDate,
  startExpanded = false,
}) => {
  const { formatMessage } = useLocale()
  const { control, getValues } = useFormContext()

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: fieldName,
  })

  // Always hold the latest parsed data so the import effect never reads a
  // stale closure value
  const parsedSubCriteriaRef = useRef(parsedSubCriteria)
  parsedSubCriteriaRef.current = parsedSubCriteria

  // Remember which import we last seeded from. Initialised to the current value
  // so that neither the initial mount nor StrictMode's double-invocation of
  // effects (the app is wrapped in <StrictMode>) is mistaken for a new import.
  // A boolean "first render" ref does NOT work here: StrictMode runs the effect
  // twice on mount and the ref survives between the two runs, so the second run
  // would proceed and overwrite saved answers with the original Excel values.
  const lastSeededDate = useRef(parsedSalaryReportDate)

  // On mount: seed with explicit priority —
  //   live form value > saved answers > parsed (external data) > empty.
  //
  // The live react-hook-form value MUST win. The form persists across screen
  // navigation while this component remounts on every screen change, so RHF
  // already holds the user's edits. The `application` prop, by contrast, can be
  // momentarily stale (e.g. ExcelTemplateDownload writes answers via a raw
  // mutation that bypasses the form reducer), so reseeding from `savedSubCriteria`
  // or the parsed Excel data would overwrite good live edits with old values.
  //
  // Do not rely on fields.length: if application.answers.subCriteria was absent
  // from the form's defaultValues at creation time, fields starts empty even
  // when the server has saved data, causing lower-priority data to win.
  useEffect(() => {
    const current = getValues(fieldName) as SubCriterion[] | undefined
    if (current && current.length > 0) return

    if (savedSubCriteria.length > 0) {
      replace(savedSubCriteria)
      return
    }

    const parsed = parsedSubCriteriaRef.current
    if (parsed.length > 0) {
      replace(mapParsedToSubCriteria(parsed))
      return
    }

    replace([{ ...DEFAULT_SUB_CRITERION }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On new workbook import: re-seed from the latest parsed data.
  // Only fires when parsedSalaryReportDate actually changes to a new value —
  // the initial mount and StrictMode's double-invoke both leave it unchanged,
  // so the user's saved answers are never overwritten on remount.
  useEffect(() => {
    if (lastSeededDate.current === parsedSalaryReportDate) return
    lastSeededDate.current = parsedSalaryReportDate
    if (!parsedSalaryReportDate) return
    const parsed = parsedSubCriteriaRef.current
    if (parsed.length > 0) {
      replace(mapParsedToSubCriteria(parsed))
    } else {
      replace([{ ...DEFAULT_SUB_CRITERION }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSalaryReportDate])

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
            fieldName={`${fieldName}.${i}`}
            index={i}
            isLast={i === fields.length - 1}
            canRemove={fields.length > 1}
            onRemove={() => remove(i)}
          />
        ))}
      </Box>

      <Box marginTop={4}>
        <Button
          size="small"
          variant="ghost"
          icon="add"
          onClick={() => append({ ...DEFAULT_SUB_CRITERION })}
        >
          {formatMessage(messages.report.subCriteria.addButton)}
        </Button>
      </Box>
    </AccordionCard>
  )
}
