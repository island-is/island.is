import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { OJOIApplication } from '../../lib/types'
import { dotToObj } from '../../lib/utils'
import { INITAL_ANSWERS, Routes } from '../../lib/constants'
import { error as errorMessages } from '../../lib/messages'
import get from 'lodash/get'
import { RecordObject } from '@island.is/shared/types'

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

const INTERVAL_TIMER = 3000
const DEBOUNCE_TIMER = 500

const keyMapper = (key: string) => {
  switch (key) {
    case Routes.ADVERT:
      return Routes.ADVERT
    case Routes.SIGNATURE:
      return Routes.SIGNATURE
    case Routes.ADDITIONS_AND_DOCUMENTS:
      return Routes.ADDITIONS_AND_DOCUMENTS
    case Routes.PUBLISHING_PREFERENCES:
      return Routes.PUBLISHING_PREFERENCES
    case Routes.PREREQUISITES:
      return Routes.PREREQUISITES
    default:
      return null
  }
}

type LocalError = {
  type: string
  message: string
}

const getLocalError = (obj: RecordObject, path: string) => {
  return get(obj, path) as LocalError | undefined
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

  console.log(error?.message)

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
          ...INITAL_ANSWERS[key],
          ...application.answers[key],
        },
      }

      const answers = dotToObj(name, { ...defaultValue }, value)

      setValue(name, value)

      // await updateApplication({
      //   variables: {
      //     locale,
      //     input: {
      //       id: application.id,
      //       answers: {
      //         advert: {
      //           title: 'test',
      //         },
      //       },
      //     },
      //   },
      // })
    },
    [
      application.answers,
      errorMessage,
      f,
      isOptional,
      localIsDirty,
      name,
      setError,
      setValue,
    ],
  )

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

  const onChange = (value: string) => {
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
      render={({ field: { onChange: onControllerChange, value, ref } }) => (
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
          errorMessage={error?.message}
          textarea={textarea}
          onChange={(e) => onControllerChange(onChange(e.target.value))}
          onBlur={(e) => handleUpdate(e.target.value)}
          rows={textarea ? 4 : undefined}
        />
      )}
    />
  )
}
