import React, { MouseEvent, useEffect, useState } from 'react'
import { Link } from '../Link/Link'
import { LinkProps } from 'next/link'
import {
  getContainerClass,
  getInteractiveProps,
  renderContents,
  ToggleSwitchBaseProps,
} from './_ToggleSwitch.utils'

export type ToggleSwitchLinkProps = Omit<
  ToggleSwitchBaseProps<HTMLAnchorElement>,
  'label' | 'onChange' | 'aria-controls' | 'role'
> &
  LinkProps & {
    href: string

    /** The actual (accessible) label that indicates what clicking the link will accomplish
     *
     * Examples:
     *  - "Show inline help"
     *  - "Hide inline help"
     */
    linkText: string

    /** The static visual-presentation label indicating the overall purpose of the toggler
     *
     * Example:
     *  - "Inline help"
     */
    label?: ToggleSwitchBaseProps['label']

    /** Callback that triggers on user interaction.
     *
     * Calling `mouseEvent.preventDefault()` prevents the browser from following the link
     */
    onChange?: (newChecked: boolean, preventDefault: () => void) => void
  }

export const ToggleSwitchLink = (props: ToggleSwitchLinkProps) => {
  const { checked, linkText } = props
  // maintain a local checked state because the href routing takes a while to kick in
  // and we want to give instant feedback in the UI...
  const [localChecked, setLocalChecked] = useState(checked)
  // ...while still respect any changes that may come in via VDOM re-render
  useEffect(() => setLocalChecked(checked), [checked])

  const visibleLabel = props.label || linkText

  if (props.disabled) {
    return (
      <span
        className={getContainerClass(props, localChecked)}
        aria-label={linkText}
      >
        {renderContents(visibleLabel, linkText)}
      </span>
    )
  }

  return (
    <Link
      href={props.href}
      as={props.as}
      scroll={props.scroll}
      replace={props.replace}
      shallow={props.shallow}
      passHref={props.passHref}
      locale={props.locale}
      prefetch={props.prefetch}
      // END LinkProps
      aria-label={linkText}
      className={getContainerClass(props, localChecked)}
      // @ts-expect-error  (Link's onClick signature is incorrect)
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (props.onChange) {
          props.onChange(!checked, () => e.preventDefault())
          if (e.isDefaultPrevented()) {
            return
          }
        }
        setLocalChecked((localChecked) => !localChecked)
      }}
      {...getInteractiveProps<HTMLAnchorElement>(props)}
    >
      {renderContents(visibleLabel, linkText)}
    </Link>
  )
}
