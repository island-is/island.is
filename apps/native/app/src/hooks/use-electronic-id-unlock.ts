import { router } from 'expo-router'
import { useRef } from 'react'

import { getIasClient } from '@/lib/ias'
import type { IasTokens } from '@/lib/ias'
import {
  electronicIdStore,
  ElectronicIdPurpose,
} from '@/stores/electronic-id-store'

/** cancel() rejects the unlock with this. */
export const isCancelled = (error: unknown) =>
  error instanceof Error && error.name === 'AbortError'

/** Closes the electronic ID sheet, if it's open. */
export function closeElectronicIdSheet() {
  if (electronicIdStore.getState().sheetRequestId === undefined) {
    return
  }
  // Cleared first, so a second call can't close the screen under it.
  electronicIdStore.setState({ sheetRequestId: undefined })
  router.back()
}

/**
 * An electronic ID unlock: IAS sends a verification code, shown in a sheet
 * while the person approves on their phone, then new tokens. Unlocking ends
 * the session from before, so the caller replaces its tokens with these.
 * To turn on biometrics the person approves that instead, in its own request.
 *
 * On success the sheet stays open, for the caller to close along with its own
 * screen. Closing the sheet cancels the request.
 */
export function useElectronicIdUnlock(purpose: ElectronicIdPurpose) {
  const controllerRef = useRef<AbortController | undefined>(undefined)

  const unlock = async (): Promise<IasTokens> => {
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      const ias = getIasClient()
      const request = await ias.startElectronicIdUnlock(
        purpose === 'enableBiometrics' ? { purpose: 'biometric-key' } : {},
      )
      const requestId = electronicIdStore.getState().requestId + 1
      electronicIdStore.setState({
        purpose,
        requestId,
        verificationCode: request.verificationCode,
        cancel: () => controller.abort(),
        sheetRequestId: requestId,
      })
      router.push('/electronic-id')
      return await ias.waitForApproval(request, { signal: controller.signal })
    } catch (error) {
      // Cancelling came from closing the sheet.
      if (!isCancelled(error)) {
        closeElectronicIdSheet()
      }
      throw error
    } finally {
      controllerRef.current = undefined
      electronicIdStore.setState({ cancel: undefined })
    }
  }

  return {
    isPending: () => controllerRef.current !== undefined,
    unlock,
    cancel() {
      controllerRef.current?.abort()
    },
  }
}
