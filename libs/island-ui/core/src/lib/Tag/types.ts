import { FC, ReactNode } from 'react'

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'rose'
  | 'blueberry'
  | 'dark'
  | 'mint'
  | 'yellow'
  | 'disabled'
  | 'warn'

export interface TagProps {
  onClick?: () => void
  variant?: TagVariant
  href?: string
  id?: string
  active?: boolean
  disabled?: boolean
  outlined?: boolean
  /** Renders a red dot driving attention to the tag. */
  attention?: boolean
  children: string | ReactNode
  truncate?: boolean
  hyphenate?: boolean
  textLeft?: boolean
  CustomLink?: FC<React.PropsWithChildren<unknown>>
  whiteBackground?: boolean
  /** When true, mint focus styling uses :focus-visible only (no flash on pointer click). */
  focusVisibleOnly?: boolean
}
