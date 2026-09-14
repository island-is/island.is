import type { SyncCommand } from './types'
import { SyncMethodEnum } from './constants'

// Shared by every draft screen that diffs its form state against the ids the
// draft had on load: entries seen before are UPDATE, new ones are CREATE, and
// any original id no longer present in `finalEntries` gets a REMOVE.
export const buildUpsertRemoveCommands = (
  originalIds: Set<string>,
  finalEntries: { id: string; data: Record<string, unknown> }[],
): SyncCommand[] => {
  const finalIds = new Set(finalEntries.map((e) => e.id))

  const upsertCommands: SyncCommand[] = finalEntries.map((e) => ({
    method: originalIds.has(e.id)
      ? SyncMethodEnum.UPDATE
      : SyncMethodEnum.CREATE,
    id: e.id,
    data: e.data,
  }))
  const removedCommands: SyncCommand[] = [...originalIds]
    .filter((id) => !finalIds.has(id))
    .map((id) => ({ method: SyncMethodEnum.REMOVE, id }))

  return [...upsertCommands, ...removedCommands]
}
