import { create } from 'zustand'

/** The error code the API answers with when a locked area needs unlocking. */
export const STEP_UP_REQUIRED = 'STEP_UP_REQUIRED'

interface StepUpStore {
  /**
   * Set when the API refused data because the session must unlock first — the
   * server noticed before we did, e.g. after a while unused. Cleared by a
   * successful unlock.
   */
  required: boolean
  markRequired(): void
  markUnlocked(): void
}

export const stepUpStore = create<StepUpStore>((set) => ({
  required: false,
  markRequired() {
    set({ required: true })
  },
  markUnlocked() {
    set({ required: false })
  },
}))

export const useStepUpStore = stepUpStore
