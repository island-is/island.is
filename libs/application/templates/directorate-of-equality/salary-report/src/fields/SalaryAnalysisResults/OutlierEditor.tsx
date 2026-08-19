import { FC, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { RecordObject } from '@island.is/application/types'
import { Box, Button, InteractiveTable, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type {
  SalaryAnalysisOutlierDto,
  ScoreBucketDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { isOutlierGroupComplete } from '../../utils/outlierGroups'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { TablePagination } from '../TablePagination'
import { useOutlierColumns } from './useOutlierColumns'
import { OutlierGroupCard } from './OutlierGroupCard'

const OUTLIERS_PAGE_SIZE = 10
// The header checkbox only reaches the current page, which is fine for a
// couple of pages but not for a long table — past this many pages the
// select-everything shortcut appears.
const SELECT_ALL_PAGE_THRESHOLD = 5

type Props = {
  outliers: SalaryAnalysisOutlierDto[]
  scoreBuckets: ScoreBucketDto[]
  errors?: RecordObject
  // draft: pre-submit, DMR-synced, keyed by employee id. postponed: answers-backed, keyed by ordinal.
  mode: 'draft' | 'postponed'
  identifierForOrdinal: (ordinal: number) => string
}

export const OutlierEditor: FC<Props> = ({
  outliers,
  scoreBuckets,
  errors,
  mode,
  identifierForOrdinal,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup

  // Same field name in both modes; draft mode just never persists it to applicationAnswers.
  const fieldName = 'salaryAnalysis.outlierGroups'

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  })

  // useFieldArray's `fields` only updates on structural changes (append/
  // remove) — it does NOT reflect keystrokes in the reason/action/signature
  // inputs below. The completeness warning needs live values, so it reads
  // from useWatch instead.
  const watchedGroups: OutlierGroupAnswer[] =
    useWatch({ name: fieldName }) ?? []

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)

  // Once an outlier is put into a group it leaves the table below — the
  // group card owns it from then on. Removing a group frees its members
  // back into this list.
  const assignedOrdinals = new Set(
    (fields as unknown as (OutlierGroupAnswer & { id: string })[]).flatMap(
      (g) => g.employeeOrdinals,
    ),
  )
  const unassignedOutliers = outliers.filter(
    (o) => !assignedOrdinals.has(o.employeeOrdinal),
  )

  const totalPages = Math.max(
    1,
    Math.ceil(unassignedOutliers.length / OUTLIERS_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  const pageRows = unassignedOutliers.slice(
    (currentPage - 1) * OUTLIERS_PAGE_SIZE,
    currentPage * OUTLIERS_PAGE_SIZE,
  )

  const toggleSelect = (ordinal: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(ordinal)) next.delete(ordinal)
      else next.add(ordinal)
      return next
    })

  const handleCreateGroup = () => {
    append({
      // Draft mode needs a stable id from creation to track by id, not array position.
      id: mode === 'draft' ? crypto.randomUUID() : undefined,
      employeeOrdinals: [...selected],
    } as OutlierGroupAnswer)
    setSelected(new Set())
    // The current page may no longer exist once its rows leave the table.
    setPage(1)
  }

  const handleSelectAll = () =>
    setSelected(new Set(unassignedOutliers.map((o) => o.employeeOrdinal)))

  const allSelected = selected.size === unassignedOutliers.length

  const allSelectedOnPage =
    pageRows.length > 0 &&
    pageRows.every((o) => selected.has(o.employeeOrdinal))

  const columns = useOutlierColumns({
    formatMessage,
    scoreBuckets,
    pageRows,
    selected,
    setSelected,
    allSelectedOnPage,
    identifierForOrdinal,
    toggleSelect,
  })

  return (
    <Box marginTop={4}>
      {unassignedOutliers.length > 0 && (
        <>
          <InteractiveTable
            columns={columns}
            data={pageRows}
            mobileTitleKey="employee"
            cellPaddingX={2}
          />

          <Box marginTop={2}>
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Box>

          <Box
            marginTop={2}
            marginBottom={2}
            display="flex"
            alignItems="center"
            columnGap={2}
          >
            <Button
              variant="ghost"
              size="small"
              icon="add"
              disabled={selected.size === 0}
              onClick={handleCreateGroup}
            >
              {formatMessage(m.createGroupButton)}
            </Button>
            {totalPages > SELECT_ALL_PAGE_THRESHOLD && (
              <Button
                variant="text"
                size="small"
                disabled={allSelected}
                onClick={handleSelectAll}
              >
                {formatMessage(m.selectAllOutliersButton, {
                  count: unassignedOutliers.length,
                })}
              </Button>
            )}
          </Box>
        </>
      )}

      <Box>
        {fields.map((field, index) => {
          const group = field as unknown as OutlierGroupAnswer & {
            id: string
          }
          return (
            <OutlierGroupCard
              key={field.id}
              fieldId={field.id}
              fieldName={fieldName}
              index={index}
              group={group}
              mode={mode}
              errors={errors}
              identifierForOrdinal={identifierForOrdinal}
              onRemove={() => remove(index)}
            />
          )
        })}
      </Box>

      {unassignedOutliers.length > 0 && (
        <Box marginTop={2}>
          <Text variant="small" color="red600">
            {formatMessage(m.unassignedWarning)}
          </Text>
        </Box>
      )}
      {unassignedOutliers.length === 0 &&
        watchedGroups.some((g) => g.employeeOrdinals.length > 0) &&
        watchedGroups.some((g) => !isOutlierGroupComplete(g)) && (
          <Box marginTop={2}>
            <Text variant="small" color="red600">
              {formatMessage(m.incompleteGroupWarning)}
            </Text>
          </Box>
        )}
    </Box>
  )
}
