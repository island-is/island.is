import React from 'react'
import {
  getContainerClass,
  getInteractiveProps,
  renderContents,
  ToggleSwitchBaseProps,
} from './_ToggleSwitch.utils'

export type ToggleSwitchCheckboxProps =
  ToggleSwitchBaseProps<HTMLInputElement> & {
    /** Optional `name=""` for the form `<input type="checkbox" />` element */
    name?: string
    /** Optional `value=""` for the form `<input type="checkbox" />` element */
    value?: string
  }

export const ToggleSwitchCheckbox = (props: ToggleSwitchCheckboxProps) => {
  const { checked } = props

  return (
    <label className={getContainerClass(props)}>
      <input
        className="visually-hidden"
        type="checkbox"
        name={props.name}
        checked={checked}
        disabled={props.disabled}
        onChange={() => props.onChange(!checked)}
        {...getInteractiveProps<HTMLInputElement>(props)}
      />
      {renderContents(props.label)}
    </label>
  )
}
