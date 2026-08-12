import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  /** Never persist — e.g. a confirmed court session or a read-only row. */
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
  const [seenResetKey, setSeenResetKey] = useState(resetKey)

  const hasUserEdited = useRef(false)
  const valueRef = useRef(value)
  const errorMessageRef = useRef(errorMessage)
  const disabledRef = useRef(disabled)

  valueRef.current = value
  errorMessageRef.current = errorMessage
  disabledRef.current = disabled

  // A different entity now occupies this slot, so this instance is no longer
  // mid-edit. Note that any already scheduled save is deliberately left alone:
  // it is bound to the entity that was being edited and must still land there.
  if (seenResetKey !== resetKey) {
    setSeenResetKey(resetKey)
    hasUserEdited.current = false
    setValue(persistedValue ?? '')
    setErrorMessage('')
  }

  // Follow server and autofill updates until the user starts editing.
  useEffect(() => {
    if (!hasUserEdited.current) {
      setValue(persistedValue ?? '')
    }
  }, [persistedValue])

  // Passing the work as an argument keeps the debounced function's identity
  // stable — so `flush` stays meaningful — while the work itself is bound at
  // the moment the user typed. That binding matters: if this instance is
  // re-rendered with a different entity, a pending save still writes to the
  // entity that was being edited rather than the new one.
  const debouncedSave = useMemo(
    () => debounce((save: () => void) => save(), delay),
    [delay],
  )

  // `react-use`'s `useDebounce` clears its timer on unmount without firing,
  // silently dropping an edit made just before navigating away — and the
  // optimistic value goes with it, since FormProvider refetches the case on
  // every route change. Flush instead.
  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [debouncedSave])

  const handleChange = useCallback(
    (newValue: string) => {
      const nextValue = newValue.includes('\t')
        ? replaceTabs(newValue)
        : newValue

      hasUserEdited.current = true
      setValue(nextValue)
      removeErrorMessageIfValid(
        validations,
        nextValue,
        errorMessageRef.current,
        setErrorMessage,
      )
      onValueChange?.(nextValue)

      // There is deliberately no `nextValue === ''` guard here: clearing a
      // field has to persist. Required fields stay protected by `validations`.
      debouncedSave(() => {
        if (disabledRef.current) {
          return
        }

        if (
          !validateAndSetErrorMessage(validations, nextValue, setErrorMessage)
        ) {
          return
        }

        onSave(nextValue)
      })
    },
    [debouncedSave, onSave, onValueChange, validations],
  )

  // Blur is an unambiguous "done editing", so persist now instead of waiting
  // out the timer. `flush` is a no-op when nothing is pending, so tabbing
  // through an untouched field never fires a mutation. The value argument is
  // accepted for call-site convenience but ignored — the input is controlled,
  // so local state is authoritative.
  const handleBlur = useCallback(
    (_value?: string) => {
      debouncedSave.flush()
      validateAndSetErrorMessage(validations, valueRef.current, setErrorMessage)
    },
    [debouncedSave, validations],
  )

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
