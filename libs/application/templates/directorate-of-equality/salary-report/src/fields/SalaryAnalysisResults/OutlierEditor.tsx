import { FC, useCallback, useMemo, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { RecordObject } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  DropdownMenu,
  Hidden,
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

  // Guarded on the length: with nothing left in the table both sides are 0,
  // which would otherwise read as "everything is selected" and show the header
  // checkbox ticked over an empty selection.
  const allSelected =
    unassignedOutliers.length > 0 && selected.size === unassignedOutliers.length

  // Drives the header checkbox's indeterminate state, so a partial selection
  // reads as partial instead of as "nothing selected" — the native flag also
  // gives the input aria-checked="mixed".
  const someSelected = selected.size > 0 && !allSelected

  // Every row still in the table, not just the page on screen: the outliers an
  // applicant wants in one group are rarely all on one page, and paging through
  // to tick them was the tedium this replaces. Clears as well as selects — it is
  // the only way back from a select-all short of unticking each row.
  const toggleSelectAll = useCallback(
    () =>
      setSelected((prev) =>
        prev.size === unassignedOutliers.length && prev.size > 0
          ? new Set()
          : new Set(unassignedOutliers.map((o) => o.employeeOrdinal)),
      ),
    [unassignedOutliers],
  )

  // The column defs are module-level constants (see outlierColumns.tsx), so
  // everything that changes per render reaches the cells through here.
  const tableContext = useMemo(
    () => ({
      selected,
      allSelected,
      someSelected,
      toggleSelect,
      toggleSelectAll,
    }),
    [selected, allSelected, someSelected, toggleSelect, toggleSelectAll],
  )

  return (
    <Box marginTop={4}>
      {unassignedOutliers.length > 0 && (
        <>
          <Box>
            <Text variant="h4" as="h4">
              {formatMessage(m.tableTitle)}
            </Text>
            <Text>{formatMessage(m.tableText)}</Text>
          </Box>
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

          {/* Counts what is ticked, however it got ticked — the header checkbox
              and the row checkboxes write to the same set. Directly under the
              table so it reads as the table's own tally, above the unit
              footnote. Hidden at zero rather than reading "0 frávik valin" over
              an untouched table.

              The live region is the outer Box, which stays mounted and carries
              no margin of its own: a region announces only changes that happen
              while it is already in the DOM, so mounting it with the count would
              announce nothing, and an empty bordered-off Box would still take up
              its margin over an untouched table. */}
          <Box aria-live="polite">
            {selected.size > 0 && (
              <Box marginTop={1}>
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(m.selectedOutlierCount, {
                    count: selected.size,
                  })}
                </Text>
              </Box>
            )}
          </Box>

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
            {/* The header checkbox is the select-all on the desktop table, but
                InteractiveTable's mobile card view has no header row to put it
                in — so below `md`, where that table is hidden, this button
                stands in for it. Same two breakpoints InteractiveTable splits
                its own views on, so exactly one of the two is ever reachable. */}
            <Hidden above="sm">
              <Button variant="text" size="small" onClick={toggleSelectAll}>
                {formatMessage(
                  allSelected
                    ? m.deselectAllOutliersButton
                    : m.selectAllOutliersButton,
                  { count: unassignedOutliers.length },
                )}
              </Button>
            </Hidden>
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
          <AlertMessage
            type="error"
            title={formatMessage(messages.errors.alertTitle)}
            message={formatMessage(m.unassignedWarning)}
          />
        </Box>
      )}
      {unassignedOutliers.length === 0 &&
        watchedGroups.some((g) => g.employeeOrdinals.length > 0) &&
        watchedGroups.some((g) => !isOutlierGroupComplete(g)) && (
          <Box marginTop={2}>
            <AlertMessage
              type="error"
              title={formatMessage(messages.errors.alertTitle)}
              message={formatMessage(m.incompleteGroupWarning)}
            />
          </Box>
        )}
    </Box>
  )
}
