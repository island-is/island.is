import { FC, useCallback, useMemo, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { RecordObject } from '@island.is/application/types'
import {
  Box,
  Button,
  DropdownMenu,
  InteractiveTable,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import {
  emptyOutlierGroupAnswer,
  foldGroupDirection,
  isOutlierGroupComplete,
} from '../../utils/outlierGroups'
import type { OutlierGroupAnswer, PayStatus } from '../../utils/outlierGroups'
import { TablePagination } from '../TablePagination'
import { OUTLIER_COLUMNS, OutlierTableProvider } from './outlierColumns'
import { OutlierGroupCard } from './OutlierGroupCard'

const OUTLIERS_PAGE_SIZE = 10
// The header checkbox only reaches the current page, which is fine for a
// couple of pages but not for a long table — past this many pages the
// select-everything shortcut appears.
const SELECT_ALL_PAGE_THRESHOLD = 5

type Props = {
  outliers: SalaryAnalysisOutlierDto[]
  errors?: RecordObject
  // draft: pre-submit, DMR-synced, keyed by employee id. postponed: answers-backed, keyed by ordinal.
  mode: 'draft' | 'postponed'
}

export const OutlierEditor: FC<Props> = ({ outliers, errors, mode }) => {
  const { formatMessage } = useLocale()
  const { control, setValue } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup

  // Only this component holds the outliers; OutlierGroupCard has ordinals and
  // needs each member's payStatus to pick its prompt variant.
  const payStatusByOrdinal = useMemo(
    () =>
      new Map<number, PayStatus>(
        outliers.map((o) => [o.employeeOrdinal, o.payStatus]),
      ),
    [outliers],
  )

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
  const watchedGroups =
    (useWatch({ name: fieldName }) as OutlierGroupAnswer[] | undefined) ?? []

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)

  // Membership is edited with setValue (assigning into an existing group, or a
  // pill click freeing one member), which useFieldArray's `fields` does not
  // see — so the live ordinals come from the watched values, positionally
  // aligned with `fields` and falling back to them on the render where a
  // structural change has landed in one but not yet the other.
  //
  // Keyed on the membership CONTENT, not on `watchedGroups`: useWatch clones its
  // whole subtree on every change, so depending on its identity would recompute
  // this — and with it unassignedOutliers and the `data` array handed to
  // InteractiveTable — on every keystroke in any group's reason/action/signature
  // field. That is precisely the churn the note on pageRows below exists to
  // prevent; membership is the only part of the subtree this reads.
  const memberKey = watchedGroups
    .map((group) => (group?.employeeOrdinals ?? []).join(','))
    .join('|')
  const memberOrdinalsByIndex = useMemo(
    () =>
      (fields as unknown as (OutlierGroupAnswer & { id: string })[]).map(
        (field, index) =>
          watchedGroups[index]?.employeeOrdinals ??
          field.employeeOrdinals ??
          [],
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, memberKey],
  )

  // Once an outlier is put into a group it leaves the table below — the
  // group card owns it from then on. Removing a group, or clicking a member's
  // pill, frees it back into this list.
  const unassignedOutliers = useMemo(() => {
    const assignedOrdinals = new Set(memberOrdinalsByIndex.flat())
    return outliers.filter((o) => !assignedOrdinals.has(o.employeeOrdinal))
  }, [memberOrdinalsByIndex, outliers])

  const totalPages = Math.max(
    1,
    Math.ceil(unassignedOutliers.length / OUTLIERS_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  // Memoised because InteractiveTable keys an effect on the `data` prop: a new
  // array identity on every render makes that effect fire and set state again,
  // costing a second render pass per interaction.
  const pageRows = useMemo(
    () =>
      unassignedOutliers.slice(
        (currentPage - 1) * OUTLIERS_PAGE_SIZE,
        currentPage * OUTLIERS_PAGE_SIZE,
      ),
    [unassignedOutliers, currentPage],
  )

  const toggleSelect = useCallback(
    (ordinal: number) =>
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(ordinal)) next.delete(ordinal)
        else next.add(ordinal)
        return next
      }),
    [],
  )

  const byOrdinal = (a: number, b: number) => a - b

  const handleCreateGroup = () => {
    append(
      emptyOutlierGroupAnswer(
        [...selected].sort(byOrdinal),
        mode === 'draft' ? crypto.randomUUID() : undefined,
      ),
    )
    setSelected(new Set())
    // The current page may no longer exist once its rows leave the table.
    setPage(1)
  }

  // Adding to a group already on the screen, rather than always minting a new
  // one: a setValue on that group's ordinals, since useFieldArray has no
  // in-place member edit that leaves the sibling inputs untouched.
  const handleAddToGroup = (index: number) => {
    setValue(
      `${fieldName}.${index}.employeeOrdinals`,
      [...new Set([...memberOrdinalsByIndex[index], ...selected])].sort(
        byOrdinal,
      ),
    )
    setSelected(new Set())
    setPage(1)
  }

  const handleRemoveMember = (index: number, ordinal: number) => {
    setValue(
      `${fieldName}.${index}.employeeOrdinals`,
      memberOrdinalsByIndex[index].filter((o) => o !== ordinal),
    )
    // The freed row joins the table, which may now need its first page shown.
    setPage(1)
  }

  // Suffixed with the index because the name is free text: two groups the
  // applicant calls "Sölufólk" would otherwise render two identical menu rows
  // bound to different groups.
  const groupLabel = (index: number) => {
    const name = watchedGroups[index]?.name?.trim()
    const fallback = `${formatMessage(m.groupHeading)} ${index + 1}`
    return name ? `${name} (${index + 1})` : fallback
  }

  const handleSelectAll = () =>
    setSelected(new Set(unassignedOutliers.map((o) => o.employeeOrdinal)))

  const allSelected = selected.size === unassignedOutliers.length

  const allSelectedOnPage =
    pageRows.length > 0 &&
    pageRows.every((o) => selected.has(o.employeeOrdinal))

  const toggleSelectPage = useCallback(
    () =>
      setSelected((prev) => {
        const next = new Set(prev)
        const allOnPage = pageRows.every((o) => next.has(o.employeeOrdinal))
        pageRows.forEach((o) =>
          allOnPage
            ? next.delete(o.employeeOrdinal)
            : next.add(o.employeeOrdinal),
        )
        return next
      }),
    [pageRows],
  )

  // The column defs are module-level constants (see outlierColumns.tsx), so
  // everything that changes per render reaches the cells through here.
  const tableContext = useMemo(
    () => ({
      selected,
      allSelectedOnPage,
      toggleSelect,
      toggleSelectPage,
    }),
    [selected, allSelectedOnPage, toggleSelect, toggleSelectPage],
  )

  return (
    <Box marginTop={4}>
      {unassignedOutliers.length > 0 && (
        <>
          <OutlierTableProvider value={tableContext}>
            <InteractiveTable
              columns={OUTLIER_COLUMNS}
              data={pageRows}
              mobileTitleKey="employee"
              // Longhand on purpose: T.Data/T.HeadData spread this object
              // over their own paddingTop/paddingBottom ('p5' = 18px) and
              // paddingLeft/paddingRight (3 = 24px) in a single useBoxStyles
              // call, and that call resolves each side as
              // `paddingTop ?? paddingY ?? padding`. A shorthand here would
              // therefore lose to the longhands already in the object, while
              // these longhands replace them outright — and also override the
              // paddingY: 2 InteractiveTable passes for body cells. The 24px
              // sides are the single biggest width cost here: 8 columns spend
              // 384px on padding alone, which is what overflows the card.
              cellBox={{
                header: {
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 'p2',
                  paddingRight: 'p2',
                },
                body: {
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 'p2',
                  paddingRight: 'p2',
                },
              }}
            />
          </OutlierTableProvider>

          <Box marginTop={1}>
            <Text variant="small" color="dark400">
              {formatMessage(m.wageUnitFootnote)}
            </Text>
          </Box>

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
            {fields.length === 0 ? (
              <Button
                variant="ghost"
                size="small"
                icon="add"
                disabled={selected.size === 0}
                onClick={handleCreateGroup}
              >
                {formatMessage(m.createGroupButton)}
              </Button>
            ) : (
              // With groups already on the screen, "put in a group" is a
              // choice, not an implicit "make another one".
              <DropdownMenu
                menuLabel={formatMessage(m.assignToGroupMenuLabel)}
                // No `title`: island-ui reads it only in the branch that builds
                // its own button, not the `disclosure` one.
                disclosure={
                  <Button
                    variant="ghost"
                    size="small"
                    icon="add"
                    disabled={selected.size === 0}
                  >
                    {formatMessage(m.createGroupButton)}
                  </Button>
                }
                items={[
                  ...fields.map((_field, index) => ({
                    title: groupLabel(index),
                    onClick: () => handleAddToGroup(index),
                  })),
                  {
                    title: formatMessage(m.assignToNewGroup),
                    onClick: handleCreateGroup,
                  },
                ]}
              />
            )}
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
          const memberOrdinals = memberOrdinalsByIndex[index]
          return (
            <OutlierGroupCard
              key={field.id}
              fieldId={field.id}
              fieldName={fieldName}
              index={index}
              liveName={watchedGroups[index]?.name}
              memberOrdinals={memberOrdinals}
              direction={foldGroupDirection(
                memberOrdinals.flatMap((ordinal) => {
                  const status = payStatusByOrdinal.get(ordinal)
                  return status ? [status] : []
                }),
              )}
              mode={mode}
              errors={errors}
              onRemove={() => remove(index)}
              onRemoveMember={(ordinal) => handleRemoveMember(index, ordinal)}
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
