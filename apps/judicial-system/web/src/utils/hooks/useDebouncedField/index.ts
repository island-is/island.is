import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'

import { replaceTabs } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import type { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

interface UseDebouncedFieldParams {
  /**
   * The persisted value — `workingCase.x`, `defendant.address`,
   * `courtSession.location`, … Adopted into local state only while the user
   * has not edited, so server and autofill updates land but a response echo
   * can't clobber what is being typed.
   *
   * One instance drives one field. When the field belongs to a list row, give
   * the component a `key` of the entity id so a reordered or deleted row
   * remounts rather than inheriting the previous row's edit.
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
}

const useDebouncedField = ({
  value: persistedValue,
  onSave,
  onChange: onValueChange,
  validations = [],
  delay = 500,
}: UseDebouncedFieldParams) => {
  const [value, setValue] = useState(persistedValue ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasUserEdited, setHasUserEdited] = useState(false)

  // Follow server and autofill updates until the user starts editing.
  useEffect(() => {
    if (!hasUserEdited) {
      setValue(persistedValue ?? '')
    }
  }, [persistedValue, hasUserEdited])

  // Passing the work as an argument keeps the debounced function's identity
  // stable — so `flush` stays meaningful — while the work itself is bound at
  // the moment the user typed rather than read back at fire time. That is what
  // makes the unmount flush below safe: it runs the save the user's last
  // keystroke asked for, against the entity that was on screen at the time.
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
      // Decide whether to persist without touching the error message. Errors
      // surface on blur, the same as every other input in the app — setting one
      // from here would make a required field complain mid-sentence, as soon as
      // the user cleared it to retype.
      if (!validate([[nextValue, validations]]).isValid) {
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
