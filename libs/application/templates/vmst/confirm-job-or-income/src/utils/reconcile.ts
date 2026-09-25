export type ReconcileEntry = Record<string, unknown> & { isRemoved?: boolean }

// Delete marker always carries `id` + `deleted: true`; some Galdur endpoints
// also require a couple of persisted fields (e.g. employerSSN on partTime /
// irregular jobs) so we allow extras.
export type ReconcileDelete = {
  id: string
  deleted: true
  [key: string]: unknown
}

type PersistedRecord = { id?: string }

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

// Splits current answer entries against persisted BE records: rows without a
// matching persisted id are creates, persisted ids not present in the entries
// are deletes ({ id, deleted: true }), and retained entries are dropped
// (submit/validate both treat edits to persisted rows as silent no-ops).
export const splitEntries = <
  TEntry extends ReconcileEntry,
  TPersisted extends PersistedRecord,
>(
  entries: TEntry[],
  persistedRecords: TPersisted[],
  idKey = 'validationId',
  buildDelete: BuildDelete<TPersisted> = defaultBuildDelete,
): { creates: TEntry[]; deletes: ReconcileDelete[] } => {
  const activeEntries = filterActive(entries) as TEntry[]

  const persistedIds = new Set(
    persistedRecords.flatMap((record) => (record.id ? [record.id] : [])),
  )
  const retainedIds = new Set(
    activeEntries.flatMap((entry) => {
      const persistedId = getPersistedIdFromEntry(entry, idKey)
      return persistedId && persistedIds.has(persistedId) ? [persistedId] : []
    }),
  )

  const creates = activeEntries.filter((entry) => {
    const persistedId = getPersistedIdFromEntry(entry, idKey)
    return !(persistedId && persistedIds.has(persistedId))
  })

  const deletes = persistedRecords.flatMap<ReconcileDelete>((record) =>
    record.id && !retainedIds.has(record.id) ? [buildDelete(record)] : [],
  )

  return { creates, deletes }
}

// Convenience wrapper that maps creates through buildCreate and concatenates
// them with the delete markers. Used by the service submission builder.
export const reconcile = <
  TEntry extends ReconcileEntry,
  TPersisted extends PersistedRecord,
  TCreate,
>(
  entries: TEntry[],
  persistedRecords: TPersisted[],
  buildCreate: (entry: TEntry) => TCreate,
  idKey = 'validationId',
  buildDelete?: BuildDelete<TPersisted>,
): Array<TCreate | ReconcileDelete> => {
  const { creates, deletes } = splitEntries(
    entries,
    persistedRecords,
    idKey,
    buildDelete,
  )
  return [...creates.map(buildCreate), ...deletes]
}
