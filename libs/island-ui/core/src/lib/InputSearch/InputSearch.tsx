import React, { useState, useCallback } from 'react'
import * as styles from './InputSearch.treat'
import cn from 'classnames'
import { Icon } from '../Icon/Icon'
import { LoadingIcon } from '../LoadingIcon/LoadingIcon'

export interface InputSearchProps {
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

export const InputSearch = (userProps: InputSearchProps, ...props: any[]) => {
  const [hasFocus, setHasFocus] = useState(false)
  const onFocus = useCallback(() => setHasFocus(true), [setHasFocus])
  const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])

  return (
    <div
      className={cn(styles.wrapper, ...props, hasFocus ? styles.focused : {})}
    >
      <input
        className={cn(
          styles.input,
          userProps.colored ? styles.colored : styles.outlined,
        )}
        id={userProps.id}
        type="text"
        value={userProps.value}
        placeholder={userProps.placeholder}
        onChange={userProps.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div>
        {!userProps.loading ? (
          <span className={cn(styles.iconWrapper)}>
            <Icon type="search" className={cn(styles.search)} />
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
