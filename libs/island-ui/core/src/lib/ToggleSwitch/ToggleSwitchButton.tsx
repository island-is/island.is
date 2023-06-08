import React from 'react'
import {
  getContainerClass,
  getInteractiveProps,
  renderContents,
  ToggleSwitchBaseProps,
} from './_ToggleSwitch.utils'

export type ToggleSwitchButtonProps =
  ToggleSwitchBaseProps<HTMLButtonElement> & {
    /** By default the button is flagged as a simple `aria-pressed="true|fase"` toggle button.
     *
     * If `expander={true}` is used the button changes to use `aria-expanded="true|false"` instead.
     */
    expander?: boolean

    'aria-controls'?: string
  }

export const ToggleSwitchButton = (props: ToggleSwitchButtonProps) => {
  const { checked } = props

  const checkedAttr = props.expander
    ? { 'aria-expanded': checked }
    : { 'aria-pressed': checked }

  return (
    <button
      type="button"
      className={getContainerClass(props)}
      disabled={props.disabled}
      {...checkedAttr}
      onClick={() => props.onChange(!checked)}
      aria-controls={props['aria-controls']}
      {...getInteractiveProps<HTMLButtonElement>(props)}
    >
      {renderContents(props.label)}
    </button>
  )
}
