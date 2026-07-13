import { ReactNode } from 'react'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './InlineLink.css'

type Props = {
  children: ReactNode
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

/**
 * A link that sits inside running text, styled blue with a thin underline
 * while inheriting font size and weight from the surrounding text.
 * Pass `to` for navigation (renders an anchor via LinkResolver) or
 * `onClick` for actions like opening a modal (renders a real button).
 */
export const InlineLink = ({ to, onClick, children }: Props) =>
  to ? (
    <LinkResolver className={styles.inlineLink} href={to}>
      {children}
    </LinkResolver>
  ) : (
    <button
      type="button"
      className={styles.inlineLink}
      onClick={() => {
        onClick?.()
      }}
    >
      {children}
    </button>
  )
