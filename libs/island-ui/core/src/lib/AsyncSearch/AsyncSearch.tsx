import React, { forwardRef, useState, ReactElement } from 'react'
import Downshift, { StateChangeFunction } from 'downshift'
import { ControllerStateAndHelpers } from 'downshift/typings'
import cn from 'classnames'
import { Input, Label, Menu, Item } from './shared'
import { Icon } from '../Icon/Icon'

import * as styles from './AsyncSearch.treat'

export type AsyncSearchSizes = 'medium' | 'large'

export type ItemCmpProps = {
  active?: boolean
  selected?: boolean
  colored?: boolean
}

export type AsyncSearchOption = {
  label: string
  value: string | number
  component?: (props: ItemCmpProps) => ReactElement
  disabled?: boolean
}

export interface AsyncSearchProps {
  label?: string
  placeholder?: string
  options: AsyncSearchOption[]
  colored?: boolean
  useFilter?: boolean
  inputValue?: string
  initialInputValue?: string
  size?: AsyncSearchSizes
  loading?: boolean
  closeMenuOnSubmit?: boolean
  onSubmit?: (inputValue: string, selectedOption?: AsyncSearchOption) => void
  onClearItems?: () => void
  onChange?: (selection: object) => void
  customFilter?: (items: AsyncSearchOption) => void
  onInputValueChange?: (
    inputValue: string,
    stateAndHelpers: ControllerStateAndHelpers<StateChangeFunction<Downshift>>,
  ) => void
}

export const AsyncSearch = forwardRef<HTMLInputElement, AsyncSearchProps>(
  (
    {
      label,
      placeholder,
      size = 'medium',
      colored,
      options,
      useFilter = false,
      customFilter,
      loading,
      inputValue,
      closeMenuOnSubmit,
      initialInputValue,
      onChange,
      onSubmit,
      onClearItems,
      onInputValueChange,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState<boolean>(false)

    const onBlur = () => setFocused(false)
    const onFocus = () => setFocused(true)

    return (
      <Downshift
        id="downshift"
        onChange={onChange}
        initialInputValue={initialInputValue}
        onInputValueChange={onInputValueChange}
        onOuterClick={(ctx) => {
          ctx.clearItems()
          ctx.setState({ inputValue })
        }}
        onStateChange={(changes, ctx) => {
          switch (changes.type) {
            case '__autocomplete_unknown__':
            case '__autocomplete_mouseup__':
            case '__autocomplete_blur_input__':
              ctx.setState({ inputValue })
              break
            default:
              break
          }
        }}
        itemToString={(item: AsyncSearchOption) => (item ? item.label : '')}
        {...props}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          getToggleButtonProps,
          closeMenu,
          isOpen,
          highlightedIndex,
          getRootProps,
          inputValue,
        }) => {
          const filter =
            customFilter ||
            ((item) =>
              inputValue &&
              item.label.toLowerCase().includes(inputValue.toLowerCase()))

          const hasLabel = Boolean(size === 'large' && label)
          const shouldShowItems =
            options.filter(useFilter ? filter : (x) => x).length > 0 && isOpen

          const onKeyDown = (event: {
            key: string
            nativeEvent: { preventDownshiftDefault: boolean }
          }) => {
            if (event.key === 'Enter') {
              // Prevent Downshift's default 'Enter' behavior.
              event.nativeEvent.preventDownshiftDefault = true

              const selectedOption =
                highlightedIndex !== null ? options[highlightedIndex] : null

              closeMenuOnSubmit && closeMenu()
              onSubmit(inputValue, selectedOption)
            }
          }

          return (
            <div
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
                  {...getInputProps({
                    onFocus,
                    onBlur,
                    ref,
                    ...(onSubmit && { onKeyDown }),
                  })}
                  isOpen={shouldShowItems}
                  colored={colored}
                  hasLabel={hasLabel}
                  size={size}
                  placeholder={placeholder}
                />
                <button
                  className={cn(styles.icon, styles.iconSizes[size])}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  {...(onSubmit
                    ? {
                        onClick: () => {
                          closeMenuOnSubmit && closeMenu()
                          onSubmit(inputValue)
                        },
                      }
                    : getToggleButtonProps())}
                >
                  <Icon type="search" width={20} color="blue400" />
                </button>
                {loading && (
                  <span
                    className={cn(
                      styles.loadingIcon,
                      styles.loadingIconSizes[size],
                    )}
                    aria-hidden="false"
                    aria-label="Loading"
                  >
                    <Icon spin type="loading" width={24} />
                  </span>
                )}
              </div>
              {hasLabel && <Label {...getLabelProps()}>{label}</Label>}
              <Menu
                {...getMenuProps({ refKey: 'ref' })}
                isOpen={isOpen}
                shouldShowItems={shouldShowItems}
              >
                {shouldShowItems
                  ? options
                      .filter(useFilter ? filter : (x) => x)
                      .map((item, index) => {
                        return (
                          <Item
                            index={index}
                            highlightedIndex={highlightedIndex}
                            isActive={highlightedIndex === index}
                            colored={colored}
                            size={size}
                            item={item}
                            {...getItemProps({
                              key: item.value,
                              index,
                              item,
                              isSelected: options.includes(item),
                            })}
                          />
                        )
                      })
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
