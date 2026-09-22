export type ReconcileEntry = Record<string, unknown> & { isRemoved?: boolean }

export type ReconcileDelete = { id: string; deleted: true }

type PersistedRecord = { id?: string }

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
    record.id && !retainedIds.has(record.id)
      ? [{ id: record.id, deleted: true }]
      : [],
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
): Array<TCreate | ReconcileDelete> => {
  const { creates, deletes } = splitEntries(entries, persistedRecords, idKey)
  return [...creates.map(buildCreate), ...deletes]
}
