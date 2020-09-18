import React, { FC } from 'react'
import Input from '../Input/Input'
import { useFormContext } from 'react-hook-form'

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
}
export const InputController: FC<Props> = ({
  autoFocus,
  disabled = false,
  error,
  id,
  label,
  name = id,
  placeholder,
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
      onChange={onChange}
    />
  )
}

export default InputController
