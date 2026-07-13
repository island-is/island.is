import { ReactNode } from 'react'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './InlineLink.css'

type Props = {
  children: ReactNode
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never })

/**
 * A link that sits inside running text, styled blue with a thin underline
 * while inheriting font size and weight from the surrounding text.
 * Pass `href` for navigation (renders an anchor via LinkResolver) or
 * `onClick` for actions like opening a modal (renders a real button).
 */
export const InlineLink = ({ href, onClick, children }: Props) =>
  href ? (
    <LinkResolver className={styles.inlineLink} href={href}>
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
