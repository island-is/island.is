import React, { useState, useCallback } from 'react'
import * as styles from './InputSearch.treat'
import cn from 'classnames'
import { Icon, LoadingIcon } from '../..'

export interface InputSearchProps {
  name: string
  value?: string | number
  id?: string
  className?: string
  placeholder?: string
  loading?: boolean
  colored?: boolean
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

export const InputSearch = (givenValues: InputSearchProps, ...props) => {
  const [hasFocus, setHasFocus] = useState(false)
  const onFocus = useCallback(() => setHasFocus(true), [setHasFocus])
  const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])

  return (
    <div
      className={cn(styles.wrapper, ...props, hasFocus ? styles.focused : {})}
    >
      <input
        className={cn(styles.input, givenValues.colored ? styles.colored : {})}
        id={givenValues.id}
        type="text"
        value={givenValues.value}
        placeholder={givenValues.placeholder}
        onChange={givenValues.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div>
        {!givenValues.loading ? (
          <span className={cn(styles.iconWrapper)}>
            <Icon type="filled" icon="search" className={cn(styles.search)} />
          </span>
        ) : (
          <span
            className={cn(styles.iconWrapper)}
            aria-hidden="false"
            aria-label="Loading"
          >
            <LoadingIcon animate color="blue400" size={16} />
          </span>
        )}
      </div>
    </div>
  )
}
