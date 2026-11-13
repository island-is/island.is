import { useRef, useState } from 'react'

import { getIasClient } from '@/lib/ias'
import type { IasTokens } from '@/lib/ias'

/** cancel() rejects the unlock with this. */
export const isCancelled = (error: unknown) =>
  error instanceof Error && error.name === 'AbortError'

/**
 * An electronic ID unlock: IAS sends a verification code to show while the
 * person approves on their phone, then new tokens. Unlocking ends the session
 * from before, so the caller replaces its tokens with these.
 */
export function useElectronicIdUnlock() {
  const [verificationCode, setVerificationCode] = useState<string>()
  const controllerRef = useRef<AbortController | undefined>(undefined)

  const unlock = async (): Promise<IasTokens> => {
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      const ias = getIasClient()
      const request = await ias.startElectronicIdUnlock()
      setVerificationCode(request.verificationCode)
      return await ias.waitForApproval(request, { signal: controller.signal })
    } finally {
      controllerRef.current = undefined
      setVerificationCode(undefined)
    }
  }

  return {
    /** Shown while waiting; undefined until IAS sends it. */
    verificationCode,
    isPending: () => controllerRef.current !== undefined,
    unlock,
    cancel() {
      controllerRef.current?.abort()
    },
  }
}
