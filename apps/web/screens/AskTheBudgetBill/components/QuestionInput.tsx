import { forwardRef } from 'react'
import cn from 'classnames'

import { Icon } from '@island.is/island-ui/core'

import * as styles from './QuestionInput.css'

interface QuestionInputProps {
  value: string
  /** Doubles as the accessible name, the box carries no visible label */
  placeholder: string
  /** Accessible name of the send button */
  sendLabel: string
  /** True while the question just asked is on its way */
  loading?: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

/**
 * The question box, shaped like the search box the rest of the site uses but
 * sending a question rather than running a search: the button is smaller and
 * only appears once there is something to send.
 */
export const QuestionInput = forwardRef<HTMLInputElement, QuestionInputProps>(
  ({ value, placeholder, sendLabel, loading, onChange, onSubmit }, ref) => {
    // Anything typed makes the button live, whatever the chat behind it is
    // doing, so the box always answers what the visitor sees in it
    const canPress = !loading && value.trim().length > 0

    return (
      <div className={styles.wrapper}>
        <input
          ref={ref}
          type="text"
          name="budget-bill-question"
          className={styles.input}
          spellCheck={false}
          autoComplete="off"
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            onSubmit()
          }}
        />

        <button
          type="button"
          className={cn(styles.button, {
            [styles.buttonInactive]: !canPress && !loading,
          })}
          aria-label={sendLabel}
          disabled={!canPress}
          onClick={onSubmit}
        >
          {loading ? (
            <span className={styles.spinner}>
              <Icon icon="reload" color="white" size="small" />
            </span>
          ) : (
            <Icon
              icon="arrowUp"
              color="white"
              size="small"
              className={styles.arrow}
            />
          )}
        </button>
      </div>
    )
  },
)
