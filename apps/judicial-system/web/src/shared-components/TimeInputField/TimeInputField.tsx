import React, { PropsWithChildren } from 'react'
import InputMask from 'react-input-mask'

interface Props {
  disabled?: boolean
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TimeInputField: React.FC<Props> = (props: PropsWithChildren<Props>) => {
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
      disabled={props.disabled}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onChange={props.onChange}
    >
      {props.children}
    </InputMask>
  )
}

export default TimeInputField
