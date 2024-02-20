import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { OJOIApplication } from '../../lib/types'
import { dotToObj } from '../../lib/utils'
import { INITAL_ANSWERS } from '../../lib/constants'

type Props = {
  application: OJOIApplication
  name: string
  defaultValue?: string
  label?: string
  placeholder?: string
  error?: string
  textarea?: boolean
}

const INTERVAL_TIMER = 2500
const DEBOUNCE_TIMER = 500

export const CustomInputController = ({
  application,
  name,
  defaultValue = '',
  label,
  placeholder,
  error,
  textarea,
}: Props) => {
  const { locale } = useLocale()

  const [updateApplication, { loading: isSaving }] =
    useMutation(UPDATE_APPLICATION)

  const { trigger } = useFormContext()

  const [localValue, setLocalValue] = useState(defaultValue)
  const [lazyValue, setLazyValue] = useState(defaultValue)

  const [mounted, setMounted] = useState(false)

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const handleUpdate = useCallback(
    async (value: string) => {
      const key = name.split('.')[0]
      const isFieldValid = await trigger(name)
      const obj = application.answers[name as keyof typeof application.answers]
      const defaultValue = obj
        ? obj
        : {
            ...INITAL_ANSWERS[key as keyof typeof INITAL_ANSWERS],
            ...application.answers[key as keyof typeof application.answers],
          }

      console.log(dotToObj(name, { ...defaultValue }, value))

      if (!isFieldValid || !key) return

      await updateApplication({
        variables: {
          locale,
          input: {
            id: application.id,
            answers: dotToObj(name, { ...defaultValue }, value),
          },
        },
      })
    },
    [application, locale, name, trigger, updateApplication],
  )

  useEffect(() => {
    const current = inputRef.current
    const interval = setInterval(() => {
      if (current && mounted) {
        if (current === document.activeElement) {
          handleUpdate(localValue)
        }
      }
    }, INTERVAL_TIMER)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, mounted])

  useEffect(() => {
    if (!mounted) return
    handleUpdate(lazyValue)
  }, [handleUpdate, lazyValue, mounted])

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted])

  const onChange = (value: string) => {
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
          errorMessage={error}
          textarea={textarea}
          onChange={(e) => onControllerChange(onChange(e.target.value))}
          onBlur={(e) => handleUpdate(e.target.value)}
          rows={textarea ? 4 : undefined}
        />
      )}
    />
  )
}
