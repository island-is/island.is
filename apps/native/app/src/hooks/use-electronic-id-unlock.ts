import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'

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
 * An electronic ID unlock: IAS sends a verification code to show while the
 * person approves on their phone, then new tokens. Unlocking ends the session
 * from before, so the caller replaces its tokens with these. To turn on
 * biometrics the person approves that instead, in its own request.
 *
 * The code is shown in a sheet, or with `inline` by the caller in place of its
 * own screen (`verificationCode`). Either way it stays up on success, so
 * nothing flashes before the caller moves on, or calls close(). Closing the
 * sheet, or leaving the caller's screen, cancels the request.
 */
export function useElectronicIdUnlock(
  purpose: ElectronicIdPurpose,
  { inline = false }: { inline?: boolean } = {},
) {
  const controllerRef = useRef<AbortController | undefined>(undefined)
  const [verificationCode, setVerificationCode] = useState<string>()

  useEffect(() => () => controllerRef.current?.abort(), [])

  const unlock = async (): Promise<IasTokens> => {
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      const ias = getIasClient()
      const request = await ias.startElectronicIdUnlock(
        purpose === 'enableBiometrics' ? { purpose: 'biometric-key' } : {},
      )
      if (inline) {
        setVerificationCode(request.verificationCode)
      } else {
        const requestId = electronicIdStore.getState().requestId + 1
        electronicIdStore.setState({
          purpose,
          requestId,
          verificationCode: request.verificationCode,
          cancel: () => controller.abort(),
          sheetRequestId: requestId,
        })
        router.push('/electronic-id')
      }
      return await ias.waitForApproval(request, { signal: controller.signal })
    } catch (error) {
      if (inline) {
        setVerificationCode(undefined)
      } else if (!isCancelled(error)) {
        // Cancelling came from closing the sheet.
        closeElectronicIdSheet()
      }
      throw error
    } finally {
      controllerRef.current = undefined
      electronicIdStore.setState({ cancel: undefined })
    }
  }

  /** Takes the code away after a success, for a caller that stays. */
  const close = () => {
    if (inline) {
      setVerificationCode(undefined)
    } else {
      closeElectronicIdSheet()
    }
  }

  return {
    /** With `inline`: shown while waiting; undefined until IAS sends it. */
    verificationCode,
    isPending: () => controllerRef.current !== undefined,
    unlock,
    close,
    cancel() {
      controllerRef.current?.abort()
    },
  }
}
