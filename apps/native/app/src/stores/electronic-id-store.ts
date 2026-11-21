import { create, useStore } from 'zustand'

export type ElectronicIdPurpose = 'unlock' | 'enableBiometrics'

/**
 * The electronic ID request the sheet shows, shared between the screen that
 * starts it and the sheet.
 */
export interface ElectronicIdStore {
  purpose: ElectronicIdPurpose
  /** Counts requests, so a sheet can tell its own from a later one. */
  requestId: number
  /** The code the person compares against the one on their phone. */
  verificationCode?: string
  /** Gives up on the request. Unset when none is waiting. */
  cancel?: () => void
  /** The request whose sheet is on screen, if any. */
  sheetRequestId?: number
}

export const electronicIdStore = create<ElectronicIdStore>(() => ({
  purpose: 'unlock',
  requestId: 0,
}))

export const useElectronicIdStore = <U = ElectronicIdStore>(
  selector?: (state: ElectronicIdStore) => U,
) => useStore(electronicIdStore, selector!)
