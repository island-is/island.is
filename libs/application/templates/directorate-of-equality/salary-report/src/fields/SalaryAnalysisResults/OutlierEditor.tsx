import { FC, useCallback, useMemo, useRef, useState } from 'react'
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
import type { OnChangeFn, SortingState } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import {
  cloneOutlierGroups,
  emptyOutlierGroupAnswer,
  foldGroupDirection,
  isOutlierGroupComplete,
  outlierGroupFingerprint,
  savedOutlierGroupIndex,
} from '../../utils/outlierGroups'
import type { OutlierGroupAnswer, PayStatus } from '../../utils/outlierGroups'
import { sortOutliers } from '../../utils/outlierSorting'
import { TablePagination } from '../TablePagination'
import { OUTLIER_COLUMNS, OutlierTableProvider } from './outlierColumns'
import { OutlierGroupCard } from './OutlierGroupCard'
import { Markdown } from '@island.is/shared/components'

const OUTLIERS_PAGE_SIZE = 10

type Props = {
  outliers: SalaryAnalysisOutlierDto[]
  errors?: RecordObject
  // draft: pre-submit, DMR-synced, keyed by employee id. postponed: answers-backed, keyed by ordinal.
  mode: 'draft' | 'postponed'
  // Writes the whole plan to the answers buffer, resolving to whether it was
  // persisted — see useOutlierPlanBuffer.
  onSaveGroups: (groups: OutlierGroupAnswer[]) => Promise<boolean>
  // The plan exactly as last written to the answers buffer — the values, not
  // just their fingerprints, because a removal has to be able to write this set
  // back minus one group. It opens as what the screen was seeded with, from the
  // buffer or from the DMR draft: either way that is already persisted, so
  // everything starts out saved and the buttons open in their "Vistað" state.
  //
  // One save carries the whole array, so this is what every card compares
  // itself against: a save from any one of them leaves them all matching.
  //
  // Held by OutlierGroupPanel rather than here: ticking the postpone checkbox
  // unmounts this editor while the form values live on in the parent, so state
  // kept here would fall back to the visit-start plan on the way back in and
  // the next removal would write that over the session's saves.
  savedGroups: OutlierGroupAnswer[]
  onSavedGroupsChange: (groups: OutlierGroupAnswer[]) => void
}

export const OutlierEditor: FC<Props> = ({
  outliers,
  errors,
  mode,
  onSaveGroups,
  savedGroups,
  onSavedGroupsChange,
}) => {
  const { formatMessage } = useLocale()
  const { control, getValues, setValue } = useFormContext()
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
  // Empty is the order the analysis listed them in. Held here rather than inside
  // InteractiveTable because the ordering has to be applied before the page is
  // sliced off — see sortedOutliers.
  const [sorting, setSorting] = useState<SortingState>([])

  const [savingIndex, setSavingIndex] = useState<number>()
  const [removingIndex, setRemovingIndex] = useState<number>()
  const [saveErrorIndex, setSaveErrorIndex] = useState<number>()
  const [removeFailed, setRemoveFailed] = useState(false)

  // Every save and every removal writes the whole plan, so two of them in
  // flight together race: the server keeps whichever response lands last,
  // regardless of which plan it carries, and the loser's completion would still
  // mark its own values as saved. One write at a time, then — every save and
  // remove button goes inert while one runs, and the ref catches a second click
  // that lands before that render does.
  const writeInFlight = useRef(false)
  const isWriting = savingIndex !== undefined || removingIndex !== undefined

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

  // Sorted here rather than by InteractiveTable, and sorted BEFORE the slice
  // below. The table only ever receives one page, so its own sorting reordered
  // the ten rows on screen and left the rest of the list alone — page 2 sorted
  // separately from page 1. `manualSorting` on the table is the other half of
  // this; see the props it is passed.
  const sortedOutliers = useMemo(
    () => sortOutliers(unassignedOutliers, sorting),
    [unassignedOutliers, sorting],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOutliers.length / OUTLIERS_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  // Memoised because InteractiveTable keys an effect on the `data` prop: a new
  // array identity on every render makes that effect fire and set state again,
  // costing a second render pass per interaction.
  const pageRows = useMemo(
    () =>
      sortedOutliers.slice(
        (currentPage - 1) * OUTLIERS_PAGE_SIZE,
        currentPage * OUTLIERS_PAGE_SIZE,
      ),
    [sortedOutliers, currentPage],
  )

  // Back to the first page whenever the order changes: the rows the reader was
  // looking at are not the rows that will be under them afterwards. TanStack
  // hands an updater rather than a value, which is exactly what setState takes.
  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      setSorting(updater)
      setPage(1)
    },
    [],
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

  const handleRemoveGroup = async (index: number) => {
    if (writeInFlight.current) return
    // The save error goes with the card it was reported on: the index it is
    // keyed by belongs to a different group once the array closes up.
    const savedIndex = savedOutlierGroupIndex(
      savedGroups,
      watchedGroups[index],
      index,
    )
    setSaveErrorIndex(undefined)
    setRemoveFailed(false)

    // A group that was never saved needs no write at all and goes straight
    // away, which is the common case: created, then thought better of.
    if (savedIndex === -1) {
      remove(index)
      return
    }

    // A group the buffer already holds has to come out of it too, or the next
    // visit seeds it straight back in. Written as the saved set minus this
    // group rather than as the live values, so removing one group does not
    // quietly persist the half-finished text in the others — the button is
    // still the only thing that saves.
    const remaining = savedGroups.filter(
      (_group, position) => position !== savedIndex,
    )
    writeInFlight.current = true
    setRemovingIndex(index)
    const persisted = await onSaveGroups(remaining)
    writeInFlight.current = false
    setRemovingIndex(undefined)
    // Both sets drop the group in the same breath, or not at all: a form that
    // had closed up over a buffer that had not would leave the positional
    // savedIndexOf fallback pointing every card below it at the wrong saved
    // group — and the card the applicant asked to remove is still there to try
    // again on.
    if (!persisted) {
      setRemoveFailed(true)
      return
    }
    onSavedGroupsChange(remaining)
    remove(index)
  }

  const handleRemoveMember = (index: number, ordinal: number) => {
    setValue(
      `${fieldName}.${index}.employeeOrdinals`,
      memberOrdinalsByIndex[index].filter((o) => o !== ordinal),
    )
    // The freed row joins the table, which may now need its first page shown.
    setPage(1)
  }

  // Read straight off the form rather than from watchedGroups: the values are
  // what goes to the server, and this is the one place that needs them exactly
  // as react-hook-form holds them — cloned on the way out, since it keeps
  // writing into them while the request is in flight.
  const handleSave = async (index: number) => {
    if (writeInFlight.current) return
    const groups = cloneOutlierGroups(
      (getValues(fieldName) ?? []) as OutlierGroupAnswer[],
    )
    writeInFlight.current = true
    setSavingIndex(index)
    setSaveErrorIndex(undefined)
    // A save writes the whole array from the live values, which is the plan a
    // failed removal left in place — so it settles that error too.
    setRemoveFailed(false)
    const persisted = await onSaveGroups(groups)
    writeInFlight.current = false
    setSavingIndex(undefined)
    if (!persisted) {
      // Reported on the card whose button was pressed, so the failure is where
      // the applicant is looking.
      setSaveErrorIndex(index)
      return
    }
    onSavedGroupsChange(groups)
  }

  const isGroupSaved = (index: number) => {
    const group = watchedGroups[index]
    const savedIndex = savedOutlierGroupIndex(savedGroups, group, index)
    return (
      savedIndex !== -1 &&
      outlierGroupFingerprint(savedGroups[savedIndex]) ===
        outlierGroupFingerprint(group)
    )
  }

  // Newest first. The array itself stays in creation order — the index is what
  // names the inputs, numbers the groups and attributes the sync commands — so
  // only the render order flips, and each entry carries its real index with it.
  const groupsNewestFirst = useMemo(
    () => fields.map((field, index) => ({ field, index })).reverse(),
    [fields],
  )

  // Suffixed with the index because the name is free text: two groups the
  // applicant calls "Sölufólk" would otherwise render two identical menu rows
  // bound to different groups.
  const groupLabel = (index: number) => {
    const name = watchedGroups[index]?.name?.trim()
    const fallback = `${formatMessage(m.groupHeading)} ${index + 1}`
    return name
      ? `${formatMessage(m.addToExistingGroupPrefix)} ${name} (${index + 1})`
      : `${formatMessage(m.addToExistingGroupPrefix)} ${fallback}`
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
      {/* Outside the table's own guard: the table empties as outliers are
          assigned to groups, and this copy is what explains that. */}
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          {formatMessage(m.tableTitle)}
        </Text>
        <Markdown>{formatMessage(m.tableText)}</Markdown>
      </Box>

      {unassignedOutliers.length > 0 && (
        <>
          <OutlierTableProvider value={tableContext}>
            <InteractiveTable
              columns={OUTLIER_COLUMNS}
              data={pageRows}
              // The table renders the sort controls and reports the clicks, but
              // does not do the sorting: `data` is one page, so ordering it here
              // would only ever order that page. sortOutliers orders the whole
              // unassigned list upstream of the slice.
              manualSorting
              sorting={sorting}
              onSortingChange={handleSortingChange}
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
                  // Same order as the cards below, so the menu reads top-down
                  // against what is on screen.
                  ...groupsNewestFirst.map(({ index }) => ({
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
        {groupsNewestFirst.map(({ field, index }) => {
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
              isSaved={isGroupSaved(index)}
              isSaving={savingIndex === index}
              isRemoving={removingIndex === index}
              isWriting={isWriting}
              saveFailed={saveErrorIndex === index}
              onRemove={() => void handleRemoveGroup(index)}
              onRemoveMember={(ordinal) => handleRemoveMember(index, ordinal)}
              onSave={() => handleSave(index)}
            />
          )
        })}
      </Box>

      {/* Editor-level rather than on a card: the removal carries the whole
          plan, so the failure is the plan's rather than any one group's.

          The live region is the outer Box, which stays mounted and carries no
          margin of its own, for the same two reasons as the selection count
          above — and assertive, because the removal the applicant asked for did
          not happen. */}
      <Box aria-live="assertive">
        {removeFailed && (
          <Box marginTop={2}>
            <AlertMessage
              type="error"
              message={formatMessage(m.removeGroupError)}
            />
          </Box>
        )}
      </Box>
      {unassignedOutliers.length > 0 && (
        <Box marginTop={2}>
          <AlertMessage
            type="warning"
            message={formatMessage(m.unassignedWarning)}
          />
        </Box>
      )}
      {unassignedOutliers.length === 0 &&
        watchedGroups.some((g) => g.employeeOrdinals.length > 0) &&
        watchedGroups.some((g) => !isOutlierGroupComplete(g)) && (
          <Box marginTop={2}>
            <AlertMessage
              type="warning"
              message={formatMessage(m.incompleteGroupWarning)}
            />
          </Box>
        )}
    </Box>
  )
}
