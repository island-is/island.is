import { Input } from '@island.is/island-ui/core'
import { FocusEvent, useRef, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { valueToNumber } from '../../lib/utils/helpers'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface ShareInputProps {
  name: string
  placeholder?: string
  label?: string
  errorMessage?: string
  onAfterChange?: (value: number) => void
  disabled?: boolean
  required?: boolean
}

const onFocusInput = (
  e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  console.log('onFocusInput', target.value)
  const len = target?.value?.length ?? 0
  target.setSelectionRange(len - 1, len - 1)
}

const onClickInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  const len = target?.value?.length ?? 0
  target.setSelectionRange(len - 1, len - 1)
}

const onKeydownInput: EventListener = (evt: Event) => {
  const e = evt as KeyboardEvent
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  const len = target?.value?.length ?? 0

  if (
    e.key === 'Backspace' &&
    target.selectionStart === len &&
    target.selectionEnd === len
  ) {
    target.setSelectionRange(len - 1, len - 1)
  }
}

const percentageRegex = new RegExp(/^(\d{1,2}|\d{1,2},|\d{1,2},\d+|100)$/)

export const ShareInput = ({
  name,
  placeholder,
  label,
  errorMessage,
  onAfterChange,
  disabled,
  required,
}: ShareInputProps) => {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const prevLen = useRef(0)
  const { control, watch } = useFormContext()
  const { formatMessage } = useLocale()

  const watchedField = watch(name)

  useEffect(() => {
    const currentRef = ref?.current

    if (currentRef) {
      currentRef.addEventListener('click', onClickInput)
      currentRef.addEventListener('keydown', onKeydownInput)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', onClickInput)
        currentRef.removeEventListener('keydown', onKeydownInput)
      }
    }
  }, [ref])

  let shareError = errorMessage

  if (
    !errorMessage &&
    ((watchedField && watchedField < 0) || watchedField > 100)
  ) {
    shareError = formatMessage(m.invalidShareValue)
  }

  useEffect(() => {
    const currentRef = ref?.current

    if (currentRef) {
      currentRef.addEventListener('click', onClickInput)
      currentRef.addEventListener('keydown', onKeydownInput)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', onClickInput)
        currentRef.removeEventListener('keydown', onKeydownInput)
      }
    }
  }, [ref])

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={'0'}
      render={({ field: { onChange, value, name } }) => (
        <Input
          ref={ref}
          label={label}
          placeholder={placeholder}
          id={name}
          name={name}
          backgroundColor="blue"
          value={`${(value || '0')?.replace('.', ',')}%`}
          onFocus={onFocusInput}
          onBlur={(e) => {
            const val = e.target.value ?? ''
            if (val.endsWith(',%')) {
              const newVal = val.replace(',%', '')
              onChange(newVal)
            }
          }}
          onChange={(e) => {
            e.preventDefault()

            const initial = e.target.value

            let val = (initial || '').replace('%', '') ?? ''

            const len = val.length ?? 0

            if (len > 1 && val[1] !== ',' && val.startsWith('0')) {
              val = val.substring(1)
            }

            const validInput = percentageRegex.test(val)
            const numberValue = valueToNumber(val, ',')

            const isRemoving = len < prevLen.current

            prevLen.current = len

            if (val === '') {
              onChange('0')
              return onAfterChange?.(numberValue)
            }

            if (isRemoving || validInput) {
              console.log('val', val)
              onChange(val.replace(',', '.'))
              return onAfterChange?.(numberValue)
            }
          }}
          hasError={!!shareError}
          errorMessage={shareError}
          disabled={disabled}
          required={required}
        />
      )}
    />
  )
}

export default ShareInput
