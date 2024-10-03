import { ChangeEvent, FC, FocusEvent, PropsWithChildren } from 'react'
import InputMask from 'react-input-mask'

interface Props {
  disabled?: boolean
  value?: string
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const TimeInputField: FC<PropsWithChildren<Props>> = ({
  disabled,
  value,
  onBlur,
  onFocus,
  onChange,
  children,
}) => {
  return (
    <InputMask
      mask={[/([0-9]|1[0-9]|2[0-3])/, /([0-9])?/, ':', /[0-9]/, /[0-9]/]}
      maskPlaceholder={null}
      beforeMaskedStateChange={({ nextState }) => {
        let { value } = nextState
        value = value.replace('::', ':')

        return {
          ...nextState,
          value,
        }
      }}
      disabled={disabled}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
      value={value}
    >
      {children}
    </InputMask>
  )
}

export default TimeInputField
