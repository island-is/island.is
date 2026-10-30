import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { PaymentFrequency } from './constants'

export type ReconcileEntry = Record<string, unknown> & { isRemoved?: boolean }

// Delete marker always carries `id` + `deleted: true`; some Galdur endpoints
// also require a couple of persisted fields (e.g. employerSSN on partTime /
// irregular jobs) so we allow extras.
export type ReconcileDelete = {
  id: string
  deleted: true
  [key: string]: unknown
}

// Galdur decides per record whether it may still be edited or deleted. A
// missing flag is treated as locked.
type PersistedRecord = { id?: string; canEdit?: boolean; canDelete?: boolean }

export type ToRow<TPersisted extends PersistedRecord> = (
  record: TPersisted,
) => Record<string, unknown>

export type BuildDelete<TPersisted extends PersistedRecord> = (
  persisted: TPersisted,
) => ReconcileDelete

const defaultBuildDelete = <TPersisted extends PersistedRecord>(
  persisted: TPersisted,
): ReconcileDelete => ({
  id: persisted.id ?? '',
  deleted: true,
})

// Convenience: emit a delete marker that carries `employerSSN` alongside the
// id, matching the Galdur invariant for partTime and irregular jobs.
export const buildEmployerSSNDelete = <
  T extends PersistedRecord & { employerSSN?: string },
>(
  persisted: T,
): ReconcileDelete => ({
  id: persisted.id ?? '',
  deleted: true,
  employerSSN: persisted.employerSSN,
})

const filterActive = (entries: ReconcileEntry[]): ReconcileEntry[] =>
  entries.filter((entry) => !entry.isRemoved)

const getPersistedIdFromEntry = (
  entry: ReconcileEntry,
  idKey: string,
): string | undefined => {
  const value = entry[idKey]
  return typeof value === 'string' && value ? value : undefined
}

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}(?:$|T)/

// Answers and persisted rows encode the same value differently: the date picker
// stores `yyyy-MM-dd` while Galdur may send a time part, numbers can be strings
// or numbers, and empty values can be '', null or undefined.
const normalizeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return String(value)
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  return ISO_DATE_PREFIX.test(trimmed) ? trimmed.slice(0, 10) : trimmed
}

const isSameValue = (a: unknown, b: unknown): boolean => {
  const left = normalizeValue(a)
  const right = normalizeValue(b)

  if (typeof left === 'string' && typeof right === 'string') {
    if (left === right) return true
    const leftNumber = Number(left)
    const rightNumber = Number(right)
    return (
      left !== '' &&
      right !== '' &&
      Number.isFinite(leftNumber) &&
      Number.isFinite(rightNumber) &&
      leftNumber === rightNumber
    )
  }

  return JSON.stringify(left) === JSON.stringify(right)
}

const getCompanyNationalId = (company: unknown): string => {
  if (typeof company !== 'object' || company === null) return ''
  const nationalId = (company as { nationalId?: unknown }).nationalId
  return typeof nationalId === 'string' ? nationalId.replace(/-/g, '') : ''
}

// Compares only the fields the persisted row maps to, so form-only keys
// (disabled, ...) never count as edits. The company name is looked up from the
// national id and may differ cosmetically from what Galdur stores, so only the
// national id is compared. One-time payments have no end date; the disabled
// dateTo field can still hold a stale value, so it is ignored for them.
export const isEntryEdited = (
  entry: Record<string, unknown>,
  persistedRow: Record<string, unknown>,
  idKey = 'validationId',
): boolean =>
  Object.keys(persistedRow).some((key) => {
    if (key === idKey) return false
    if (
      key === 'dateTo' &&
      entry.paymentFrequency === PaymentFrequency.ONE_TIME &&
      persistedRow.paymentFrequency === PaymentFrequency.ONE_TIME
    ) {
      return false
    }
    if (key === 'company') {
      return (
        getCompanyNationalId(entry.company) !==
        getCompanyNationalId(persistedRow.company)
      )
    }
    return !isSameValue(entry[key], persistedRow[key])
  })

// Splits current answer entries against persisted BE records:
// - creates: rows without a matching persisted id.
// - updates: retained rows whose values differ from the persisted record
//   (needs `toRow`) and whose record allows editing.
// - removedRecords: persisted records no longer present in the entries and
//   which allow deleting.
// Edits/deletes of locked records are dropped here so the overview, validation
// and submission never act on them, even if the answers were tampered with.
export const splitPersisted = <
  TEntry extends ReconcileEntry,
  TPersisted extends PersistedRecord,
>(
  entries: TEntry[],
  persistedRecords: TPersisted[],
  idKey = 'validationId',
  toRow?: ToRow<TPersisted>,
): { creates: TEntry[]; updates: TEntry[]; removedRecords: TPersisted[] } => {
  const activeEntries = filterActive(entries) as TEntry[]

  const persistedById = new Map(
    persistedRecords.flatMap((record) =>
      record.id ? [[record.id, record] as const] : [],
    ),
  )

  const creates: TEntry[] = []
  const updates: TEntry[] = []
  const retainedIds = new Set<string>()

  for (const entry of activeEntries) {
    const persistedId = getPersistedIdFromEntry(entry, idKey)
    const persisted = persistedId ? persistedById.get(persistedId) : undefined

    if (!persistedId || !persisted) {
      creates.push(entry)
      continue
    }

    retainedIds.add(persistedId)
    if (
      toRow &&
      persisted.canEdit === true &&
      isEntryEdited(entry, toRow(persisted), idKey)
    ) {
      updates.push(entry)
    }
  }

  const removedRecords = persistedRecords.filter(
    (record) =>
      record.id && !retainedIds.has(record.id) && record.canDelete === true,
  )

  return { creates, updates, removedRecords }
}

export type SplitOptions<TPersisted extends PersistedRecord> = {
  idKey?: string
  buildDelete?: BuildDelete<TPersisted>
  // Required to detect edits; without it retained rows are never sent.
  toRow?: ToRow<TPersisted>
}

// Same split, with the removed records mapped into Galdur delete markers.
export const splitEntries = <
  TEntry extends ReconcileEntry,
  TPersisted extends PersistedRecord,
>(
  entries: TEntry[],
  persistedRecords: TPersisted[],
  {
    idKey = 'validationId',
    buildDelete = defaultBuildDelete,
    toRow,
  }: SplitOptions<TPersisted> = {},
): { creates: TEntry[]; updates: TEntry[]; deletes: ReconcileDelete[] } => {
  const { creates, updates, removedRecords } = splitPersisted(
    entries,
    persistedRecords,
    idKey,
    toRow,
  )

  return { creates, updates, deletes: removedRecords.map(buildDelete) }
}

// Maps creates through buildCreate, sends edited rows through the same builder
// with the persisted `id` set (Galdur treats a create with an id as an update)
// and appends the delete markers. Used by the service submission builder.
export const reconcile = <
  TEntry extends ReconcileEntry,
  TPersisted extends PersistedRecord,
  TCreate,
>(
  entries: TEntry[],
  persistedRecords: TPersisted[],
  buildCreate: (entry: TEntry) => TCreate,
  options: SplitOptions<TPersisted> = {},
): Array<TCreate | (TCreate & { id: string }) | ReconcileDelete> => {
  const idKey = options.idKey ?? 'validationId'
  const { creates, updates, deletes } = splitEntries(
    entries,
    persistedRecords,
    options,
  )

  return [
    ...creates.map(buildCreate),
    ...updates.map((entry) => ({
      ...buildCreate(entry),
      id: getPersistedIdFromEntry(entry, idKey) ?? '',
    })),
    ...deletes,
  ]
}

const findPersistedRecordForRow = (
  application: Application,
  row: Record<string, unknown>,
  persistedPath: string,
  idKey: string,
): PersistedRecord | undefined => {
  const rowId = getPersistedIdFromEntry(row, idKey)
  if (!rowId) return undefined

  const persistedRecords =
    getValueViaPath<PersistedRecord[]>(
      application.externalData,
      persistedPath,
    ) ?? []

  return persistedRecords.find((record) => record.id === rowId)
}

// Row gates for buildTableRepeaterField: rows the user added in this session
// can always be edited/removed, rows mirroring a persisted BE record follow
// that record's canEdit/canDelete flag.
const buildPersistedRowGate =
  (flag: 'canEdit' | 'canDelete') =>
  (persistedPath: string, idKey = 'validationId') =>
  (application: Application, row: Record<string, unknown>): boolean => {
    const record = findPersistedRecordForRow(
      application,
      row,
      persistedPath,
      idKey,
    )
    return record ? record[flag] === true : true
  }

export const buildCanRemoveRow = buildPersistedRowGate('canDelete')
export const buildCanEditRow = buildPersistedRowGate('canEdit')
