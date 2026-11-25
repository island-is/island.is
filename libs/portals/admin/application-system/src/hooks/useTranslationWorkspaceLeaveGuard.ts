import { useCallback, useEffect, useRef, useState } from 'react'
import { useBlocker } from 'react-router-dom'

type UseTranslationWorkspaceLeaveGuardArgs = {
  hasUnsavedChanges: boolean
  onSave: () => Promise<boolean>
  onDiscard: () => void
}

export const useTranslationWorkspaceLeaveGuard = ({
  hasUnsavedChanges,
  onSave,
  onDiscard,
}: UseTranslationWorkspaceLeaveGuardArgs) => {
  const allowLeaveRef = useRef(false)
  const [leaveGuardSaving, setLeaveGuardSaving] = useState(false)

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowLeaveRef.current) {
      return false
    }

    return (
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    )
  })

  useEffect(() => {
    if (blocker.state === 'unblocked') {
      allowLeaveRef.current = false
    }
  }, [blocker.state])

  useEffect(() => {
    if (blocker.state === 'blocked' && !hasUnsavedChanges) {
      blocker.proceed()
    }
  }, [blocker, hasUnsavedChanges])

  const handleSaveAndLeave = useCallback(async () => {
    setLeaveGuardSaving(true)
    try {
      const ok = await onSave()
      if (!ok) {
        return
      }
      allowLeaveRef.current = true
      if (blocker.state === 'blocked') {
        blocker.proceed()
      }
    } finally {
      setLeaveGuardSaving(false)
    }
  }, [onSave, blocker])

  const handleDiscardAndLeave = useCallback(() => {
    allowLeaveRef.current = true
    onDiscard()
    if (blocker.state === 'blocked') {
      blocker.proceed()
    }
  }, [onDiscard, blocker])

  const handleCancelLeave = useCallback(() => {
    if (leaveGuardSaving) {
      return
    }
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
  }, [blocker, leaveGuardSaving])

  return {
    leaveGuardVisible: blocker.state === 'blocked' && hasUnsavedChanges,
    leaveGuardSaving,
    handleSaveAndLeave,
    handleDiscardAndLeave,
    handleCancelLeave,
  }
}
