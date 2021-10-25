import * as s from './ToggleSwitch.css'

import React from 'react'
import cn from 'classnames'

type TogglerElms = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement

type InteractiveProps<Elm extends TogglerElms = TogglerElms> = Pick<
  JSX.IntrinsicElements[Elm extends HTMLAnchorElement
    ? 'a'
    : Elm extends HTMLButtonElement
    ? 'button'
    : 'input'],
  'onFocus' | 'onBlur'
>

export type ToggleSwitchBaseProps<Elm extends TogglerElms = TogglerElms> = {
  /** The visible label text */
  label: string | JSX.Element
  /** The current checked state of the component */
  checked: boolean
  /** When disabled, onClick does not trigger. */
  disabled?: boolean
  /** Callback that triggers on user interaction */
  onChange: (newChecked: boolean) => void
  /** Custom **additional** class-name applied to the container element */
  className?: string
  /** Renders a full-width version of the ToggleSwicth */
  wide?: boolean
  /** Renders a "large" version of the ToggleSwicth */
  large?: boolean
  /** Set to true to create a standalone ToggleSwitch with no visible label
   *
   * This can be useful if the "visible label needs to contain rich/interactive elements (links, etc.)"
   */
  hiddenLabel?: boolean
} & InteractiveProps<Elm>

export const getContainerClass = (
  props: Pick<
    ToggleSwitchBaseProps,
    'className' | 'large' | 'wide' | 'checked' | 'disabled' | 'hiddenLabel'
  >,
  localChecked = props.checked,
) =>
  cn(
    props.className,
    s.toggleSwitch,
    props.large && s.toggleSwitchLarge,
    props.wide && s.toggleSwitchWide,
    localChecked && s.toggleSwitchChecked,
    props.disabled && s.toggleSwitchDisabled,
    props.hiddenLabel && s.toggleSwitchHiddenLabel,
  )

export const getInteractiveProps = <Elm extends TogglerElms>(
  props: InteractiveProps<Elm>,
): InteractiveProps<Elm> => ({
  onFocus: props.onFocus,
  onBlur: props.onBlur,
})

export const renderContents = (
  visibleLabel: ToggleSwitchBaseProps['label'],
  title?: string,
) => [
  <div key="knob" className={s.knob} title={title}></div>,
  <span key="label" className={s.text} title={title}>
    {visibleLabel}
  </span>,
]
