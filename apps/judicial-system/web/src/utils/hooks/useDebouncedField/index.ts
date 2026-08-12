import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'

import { replaceTabs } from '../../formatters'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '../../formHelper'
import { Validation } from '../../validate'

interface UseDebouncedFieldParams {
  /**
   * The persisted value — `workingCase.x`, `defendant.address`,
   * `courtSession.location`, … Adopted into local state only while the user
   * has not edited, so server and autofill updates land but a response echo
   * can't clobber what is being typed.
   */
  value: string | null | undefined
  /**
   * Persist. Called once, `delay` ms after the last keystroke, on blur, or on
   * unmount. Keep value coercion (`trim`, `|| null`, `parseInt`) in here —
   * this hook only deals in strings.
   */
  onSave: (value: string) => void
  /** Optimistic local write. Called on every keystroke. */
  onChange?: (value: string) => void
  validations?: Validation[]
  delay?: number
  /**
   * Never persist — e.g. a confirmed court session or a read-only row. Read
   * when the save is scheduled rather than when it fires, so an edit made
   * while the field was still editable is not silently dropped by a later
   * state change.
   */
  disabled?: boolean
  /**
   * Identity of the entity this field belongs to (defendant id, indictment
   * count id, …). When it changes, the hook stops considering itself mid-edit
   * and re-adopts `value`, so a reused list slot can't keep showing the
   * previous entity's text.
   */
  resetKey?: string
}

const useDebouncedField = ({
  value: persistedValue,
  onSave,
  onChange: onValueChange,
  validations = [],
  delay = 500,
  disabled = false,
  resetKey,
}: UseDebouncedFieldParams) => {
  const [value, setValue] = useState(persistedValue ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [seenResetKey, setSeenResetKey] = useState(resetKey)

  // A different entity now occupies this slot, so this instance is no longer
  // mid-edit. Adjusting state during render is the supported way to respond to
  // a changed input. Any already scheduled save is deliberately left alone: it
  // is bound to the entity that was being edited and must still land there.
  if (seenResetKey !== resetKey) {
    setSeenResetKey(resetKey)
    setHasUserEdited(false)
    setValue(persistedValue ?? '')
    setErrorMessage('')
  }

  // Follow server and autofill updates until the user starts editing.
  useEffect(() => {
    if (!hasUserEdited) {
      setValue(persistedValue ?? '')
    }
  }, [persistedValue, hasUserEdited])

  // Passing the work as an argument keeps the debounced function's identity
  // stable — so `flush` stays meaningful — while the work itself is bound at
  // the moment the user typed. That binding matters: if this instance is
  // re-rendered with a different entity, a pending save still writes to the
  // entity that was being edited rather than the new one.
  const debouncedSave = useMemo(
    () => debounce((save: () => void) => save(), delay),
    [delay],
  )

  // Flush on unmount rather than cancel. An edit made within `delay` of
  // navigating away would otherwise be dropped, and the optimistic value goes
  // with it, since FormProvider refetches the case on every route change.
  // Keying the cleanup on `debouncedSave` also flushes the outgoing instance
  // if `delay` ever changes.
  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [debouncedSave])

  // The two handlers below are deliberately not wrapped in useCallback. Every
  // call site passes `validations` and the callbacks as inline literals, so a
  // dependency array would change on every render and the memoisation would be
  // a no-op that only hides that fact.
  const handleChange = (newValue: string) => {
    const nextValue = newValue.includes('\t') ? replaceTabs(newValue) : newValue

    setHasUserEdited(true)
    setValue(nextValue)
    removeErrorMessageIfValid(
      validations,
      nextValue,
      errorMessage,
      setErrorMessage,
    )
    onValueChange?.(nextValue)

    // There is deliberately no `nextValue === ''` guard here: clearing a
    // field has to persist. Required fields stay protected by `validations`.
    debouncedSave(() => {
      if (disabled) {
        return
      }

      if (
        !validateAndSetErrorMessage(validations, nextValue, setErrorMessage)
      ) {
        return
      }

      onSave(nextValue)
    })
  }

  // Blur is an unambiguous "done editing", so persist now instead of waiting
  // out the timer. `flush` is a no-op when nothing is pending, so tabbing
  // through an untouched field never fires a mutation. The value argument is
  // accepted for call-site convenience but ignored — the input is controlled,
  // so local state is authoritative.
  const handleBlur = (_value?: string) => {
    debouncedSave.flush()
    validateAndSetErrorMessage(validations, value, setErrorMessage)
  }

  const flush = useCallback(() => {
    debouncedSave.flush()
  }, [debouncedSave])

  return {
    value,
    errorMessage,
    hasError: errorMessage !== '',
    onChange: handleChange,
    onBlur: handleBlur,
    /** Persist a pending edit right now, e.g. before an explicit submit. */
    flush,
  }
}

export default useDebouncedField
