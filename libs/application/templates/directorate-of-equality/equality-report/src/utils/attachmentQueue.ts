import { useCallback, useSyncExternalStore } from 'react'

/**
 * Fylgiskjöl upload/remove state, kept outside the field so it outlives it.
 *
 * ui-shell's back navigation runs no before-submit guard, so the field can
 * unmount mid-queue. The queue keeps going regardless, and a field mounted
 * again later picks up where it is: still busy, the same errors, and told
 * each time the queue moves on so it can reload the list.
 */
export type AttachmentQueueState = {
  uploading?: string
  removingId?: string
  errors: string[]
}

const IDLE: AttachmentQueueState = { errors: [] }
const states = new Map<string, AttachmentQueueState>()
const listeners = new Map<string, Set<() => void>>()

export const getAttachmentQueue = (
  applicationId: string,
): AttachmentQueueState => states.get(applicationId) ?? IDLE

export const updateAttachmentQueue = (
  applicationId: string,
  patch: Partial<AttachmentQueueState>,
) => {
  states.set(applicationId, { ...getAttachmentQueue(applicationId), ...patch })
  listeners.get(applicationId)?.forEach((listener) => listener())
}

const subscribe = (applicationId: string, listener: () => void) => {
  const set = listeners.get(applicationId) ?? new Set()
  set.add(listener)
  listeners.set(applicationId, set)
  return () => {
    set.delete(listener)
  }
}

export const useAttachmentQueue = (applicationId: string) =>
  useSyncExternalStore(
    useCallback(
      (listener: () => void) => subscribe(applicationId, listener),
      [applicationId],
    ),
    () => getAttachmentQueue(applicationId),
  )

/**
 * Uploads the files one at a time, recording progress and errors in the
 * queue. Runs to the end whether or not a field is still mounted.
 */
export const runAttachmentUploads = async (
  applicationId: string,
  files: File[],
  uploadOne: (file: File) => Promise<string | undefined>,
  initialErrors: string[] = [],
) => {
  const errors = [...initialErrors]
  updateAttachmentQueue(applicationId, { errors: [...errors] })
  try {
    for (const file of files) {
      updateAttachmentQueue(applicationId, { uploading: file.name })
      const error = await uploadOne(file)
      if (error) {
        errors.push(error)
        updateAttachmentQueue(applicationId, { errors: [...errors] })
      }
    }
  } finally {
    updateAttachmentQueue(applicationId, { uploading: undefined })
  }
}
