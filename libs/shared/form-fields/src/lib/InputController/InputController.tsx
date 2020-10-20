import React, { FC } from 'react'
import { Input } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { textarea } from 'libs/island-ui/core/src/lib/Input/Input.treat'

interface Props {
  autoFocus?: boolean
  disabled?: boolean
  error?: string
  id: string
  label?: string
  name?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  placeholder?: string
  textarea?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
}
export const InputController: FC<Props> = ({
  autoFocus,
  disabled = false,
  error,
  id,
  label,
  name = id,
  placeholder,
  textarea,
  type = 'text',
  onChange,
}) => {
  const { register } = useFormContext()
  return (
    <Input
      id={id}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      label={label}
      ref={register}
      autoFocus={autoFocus}
      hasError={error !== undefined}
      errorMessage={error}
      textarea={textarea}
      type={type}
      onChange={onChange}
    />
  )
}

export default InputController
