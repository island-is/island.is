import React, { forwardRef, useState } from 'react'
import Downshift, { DownshiftProps } from 'downshift'
import cn from 'classnames'
import { Input, Label, Menu, Item } from './shared'
import { Icon } from '../..'

import * as styles from './AsyncSearch.treat'

export type Sizes = 'medium' | 'large'

export type AsyncSearchOption = {
  label: string
  value: string | number
  disabled?: boolean
}

export interface AsyncSearchProps {
  label?: string
  placeholder?: string
  options: AsyncSearchOption[]
  colored?: boolean
  size?: Sizes
  loading?: boolean
  onChange?: (selection: object) => void
  onInputValueChange?: (inputValue: string, stateAndHelpers: object) => void
}

export const AsyncSearch = forwardRef<HTMLDivElement, AsyncSearchProps>(
  (
    {
      label,
      placeholder,
      size = 'medium',
      colored,
      options,
      loading,
      onChange,
      onInputValueChange,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState<boolean>(false)

    const onBlur = () => setFocused(false)
    const onFocus = () => setFocused(true)

    return (
      <Downshift
        onChange={onChange}
        onInputValueChange={onInputValueChange}
        itemToString={(item: AsyncSearchOption) => (item ? item.label : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          getToggleButtonProps,
          isOpen,
          highlightedIndex,
          getRootProps,
        }) => {
          const hasLabel = Boolean(size === 'large' && label)
          const shouldShowItems = options.length > 0 && isOpen

          return (
            <div
              ref={ref}
              className={cn(styles.wrapper, {
                [styles.focused]: shouldShowItems || focused,
                [styles.open]: shouldShowItems,
              })}
            >
              <div
                {...getRootProps(
                  { refKey: 'ref' },
                  {
                    suppressRefError: true,
                  },
                )}
              >
                <Input
                  {...getInputProps({ onFocus, onBlur })}
                  isOpen={shouldShowItems}
                  colored={colored}
                  hasLabel={hasLabel}
                  size={size}
                  placeholder={placeholder}
                />
                {loading && (
                  <span className={styles.icon}>
                    <Icon spin type="loading" width={24} />
                  </span>
                )}
                {!loading && (
                  <button className={styles.icon} {...getToggleButtonProps()}>
                    <Icon type="search" width={20} />
                  </button>
                )}
              </div>
              {hasLabel && <Label {...getLabelProps()}>{label}</Label>}
              <Menu {...getMenuProps({ refKey: 'ref' })} isOpen={isOpen}>
                {shouldShowItems
                  ? options.map((item, index) => (
                      <Item
                        index={index}
                        highlightedIndex={highlightedIndex}
                        isActive={highlightedIndex === index}
                        colored={colored}
                        size={size}
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          isSelected: options.includes(item),
                        })}
                      >
                        {item.label}
                      </Item>
                    ))
                  : null}
              </Menu>
            </div>
          )
        }}
      </Downshift>
    )
  },
)

export default AsyncSearch
