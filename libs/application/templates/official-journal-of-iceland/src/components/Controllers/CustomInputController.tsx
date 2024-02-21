import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { OJOIApplication } from '../../lib/types'
import { dotToObj, getLocalError, keyMapper } from '../../lib/utils'
import {
  DEBOUNCE_TIMER,
  INITIAL_ANSWERS,
  INTERVAL_TIMER,
} from '../../lib/constants'
import { error as errorMessages } from '../../lib/messages'

type Props = {
  application: OJOIApplication
  name: string
  defaultValue?: string
  label?: string
  placeholder?: string
  errorMessage?: string
  textarea?: boolean
  required?: boolean
  isOptional?: boolean
}

export const CustomInputController = ({
  application,
  name,
  defaultValue = '',
  label,
  placeholder,
  errorMessage,
  textarea,
  required = false,
  isOptional = false,
}: Props) => {
  const { locale, formatMessage: f } = useLocale()

  const [updateApplication, { loading: isSaving }] =
    useMutation(UPDATE_APPLICATION)

  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const error = getLocalError(errors, name)

  const [localValue, setLocalValue] = useState(defaultValue)
  const [lazyValue, setLazyValue] = useState(defaultValue)

  const [localError, setLocalError] = useState(false)
  const [localIsDirty, setLocalIsDirty] = useState(false)

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const handleUpdate = useCallback(
    async (value: string) => {
      const key = keyMapper(name.split('.')[0])

      if (!key) {
        return
      }

      if (localIsDirty && !isOptional && value.length === 0) {
        setLocalError(true)
        setError(name, {
          type: 'required',
          message: errorMessage
            ? errorMessage
            : f(errorMessages.emptyFieldError),
        })
      }

      const defaultValue = {
        [key]: {
          ...INITIAL_ANSWERS[key],
          ...application.answers[key],
        },
      }

      const answers = dotToObj(name, { ...defaultValue }, value)

      setValue(name, value)

      await updateApplication({
        variables: {
          locale,
          input: {
            id: application.id,
            skipValidation: true,
            answers: {
              ...answers,
            },
          },
        },
      })
    },
    [
      application.answers,
      application.id,
      errorMessage,
      f,
      isOptional,
      localIsDirty,
      locale,
      name,
      setError,
      setValue,
      updateApplication,
    ],
  )

  const handleChange = (value: string) => {
    if (!localIsDirty) {
      setLocalIsDirty(true)
    }
    if (localError) {
      setLocalError(false)
      clearErrors(name)
    }

    setLocalValue(value)
    return value
  }

  useEffect(() => {
    const current = inputRef.current
    const interval = setInterval(() => {
      if (current) {
        if (current === document.activeElement) {
          handleUpdate(current.value)
        }
      }
    }, INTERVAL_TIMER)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, handleUpdate])

  useEffect(() => {
    const handler = () => {
      handleUpdate(localValue)
    }

    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  })

  useEffect(() => {
    handleUpdate(lazyValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyValue])

  useDebounce(
    () => {
      setLazyValue(localValue)
    },
    DEBOUNCE_TIMER,
    [localValue],
  )

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref } }) => (
        <Input
          required={required}
          ref={(e) => {
            ref(e)
            inputRef.current = e
          }}
          id={name}
          name={name}
          label={label}
          placeholder={placeholder}
          backgroundColor="blue"
          size="sm"
          loading={isSaving}
          value={value}
          hasError={Boolean(error)}
          errorMessage={typeof error === 'string' ? error : error?.message}
          textarea={textarea}
          onChange={(e) => onChange(handleChange(e.target.value))}
          onBlur={(e) => handleUpdate(e.target.value)}
          rows={textarea ? 4 : undefined}
        />
      )}
    />
  )
}
