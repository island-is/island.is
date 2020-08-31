import React, {
  forwardRef,
  useState,
  ReactElement,
  HTMLProps,
  ButtonHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'
import Downshift, { StateChangeFunction } from 'downshift'
import { ControllerStateAndHelpers } from 'downshift/typings'
import cn from 'classnames'
import { Input, InputProps, Label, Menu, MenuProps, Item } from './shared'
import { Icon } from '../Icon/Icon'

import * as styles from './AsyncSearch.treat'

export type AsyncSearchSizes = 'medium' | 'large'

export type ItemCmpProps = {
  active?: boolean
  selected?: boolean
  colored?: boolean
  white?: boolean
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
  filter?: boolean | ((x: AsyncSearchOption) => boolean)
  inputValue?: string
  initialInputValue?: string
  size?: AsyncSearchSizes
  loading?: boolean
  closeMenuOnSubmit?: boolean
  white?: boolean
  on?: AsyncSearchInputProps['on']
  onSubmit?: (inputValue: string, selectedOption?: AsyncSearchOption) => void
  onChange?: (selection: object) => void
  onInputValueChange?: (
    inputValue: string,
    stateAndHelpers: ControllerStateAndHelpers<
      StateChangeFunction<AsyncSearchOption>
    >,
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
      filter = false,
      loading,
      inputValue,
      initialInputValue,
      white,
      on,
      closeMenuOnSubmit,
      onChange,
      onSubmit,
      onInputValueChange,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState<boolean>(false)

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    const hasLabel = Boolean(size === 'large' && label)

    return (
      <Downshift
        id="downshift"
        onChange={onChange}
        initialInputValue={initialInputValue}
        onInputValueChange={onInputValueChange}
        onOuterClick={(ctx) => {
          ctx.clearItems()
          ctx.setState({ inputValue })
          ctx.closeMenu()
        }}
        onStateChange={(changes, ctx) => {
          switch (changes.type) {
            case Downshift.stateChangeTypes.unknown:
            case Downshift.stateChangeTypes.mouseUp:
            case Downshift.stateChangeTypes.blurInput:
              ctx.setState({ inputValue })
          }
        }}
        itemToString={(item: AsyncSearchOption) => (item ? item.label : '')}
        {...props}
      >
        {(downshiftProps: ControllerStateAndHelpers<AsyncSearchOption>) => {
          const {
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
          } = downshiftProps

          const filterFunc = createFilterFunction(filter, inputValue)
          const filteredOptions = options.filter(filterFunc)
          const shouldShowItems = filteredOptions.length > 0 && isOpen

          const menuContent =
            shouldShowItems &&
            filteredOptions.map((item, index) => (
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
            ))

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
            <AsyncSearchInput
              hasFocus={focused}
              loading={loading}
              rootProps={getRootProps(
                { refKey: 'ref' },
                { suppressRefError: true },
              )}
              inputProps={{
                ...getInputProps({
                  value: inputValue,
                  onFocus,
                  onBlur,
                  ref,
                  ...(onSubmit && { onKeyDown }),
                }),
                inputSize: size,
                isOpen: shouldShowItems,
                colored,
                hasLabel,
                placeholder,
                white,
                on,
              }}
              buttonProps={{
                onFocus,
                onBlur,
                ...(onSubmit
                  ? {
                      onClick: () => {
                        closeMenuOnSubmit && closeMenu()
                        onSubmit(inputValue)
                      },
                    }
                  : getToggleButtonProps()),
              }}
              label={label}
              labelProps={getLabelProps()}
              menuProps={{
                ...getMenuProps(),
                isOpen,
                shouldShowItems,
              }}
            >
              {menuContent}
            </AsyncSearchInput>
          )
        }}
      </Downshift>
    )
  },
)

const createFilterFunction = (
  filter: AsyncSearchProps['filter'],
  inputValue: string,
): ((item: AsyncSearchOption) => boolean) => {
  if (typeof filter === 'function') {
    return filter
  }

  if (filter) {
    return (item) =>
      item.label.toLowerCase().includes((inputValue ?? '').toLowerCase())
  }

  return () => true
}

export interface AsyncSearchInputProps {
  hasFocus: boolean
  rootProps: HTMLProps<HTMLDivElement>
  inputProps: InputProps
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>
  menuProps?: Partial<MenuProps>
  white?: boolean
  on?: InputProps['on']
  label?: string
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  loading?: boolean
  children?: ReactNode
}

export const AsyncSearchInput = forwardRef<
  HTMLInputElement,
  AsyncSearchInputProps
>(
  (
    {
      hasFocus,
      rootProps,
      inputProps,
      buttonProps,
      loading = false,
      white = false,
      on = 'white',
      label,
      labelProps = {},
      menuProps = {},
      children,
    },
    ref,
  ) => {
    const { value, inputSize: size } = inputProps
    const showLabel = Boolean(size === 'large' && label)
    const isOpen = hasFocus && !!children && React.Children.count(children) > 0

    return (
      <div
        {...rootProps}
        className={cn(styles.wrapper, {
          [styles.focused]: hasFocus || isOpen,
          [styles.open]: isOpen,
          [styles.white]: white,
        })}
      >
        <Input {...inputProps} white={white} on={on} isOpen={isOpen} ref={ref} />
        <button
          className={cn(styles.icon, styles.iconSizes[size], {
            [styles.iconWhite]: value && white,
            [styles.focusable]: value,
          })}
          tabIndex={value ? 0 : -1}
          {...buttonProps}
        >
          <Icon type="search" width={20} color={white ? 'white' : 'blue400'} />
        </button>
        {loading && (
          <span
            className={cn(styles.loadingIcon, styles.loadingIconSizes[size])}
            aria-hidden="false"
            aria-label="Loading"
          >
            <Icon
              spin
              type="loading"
              width={24}
              color={white ? 'white' : 'blue400'}
            />
          </span>
        )}
        {showLabel && (
          <Label hasLabel={showLabel} {...labelProps}>
            {label}
          </Label>
        )}
        <Menu {...{ isOpen, shouldShowItems: isOpen, ...menuProps }}>
          {children}
        </Menu>
      </div>
    )
  },
)

export default AsyncSearch
