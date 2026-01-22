import * as inputStyles from '../Input/Input.css'
import * as styles from './AsyncSearch.css'

import Downshift, { DownshiftProps } from 'downshift'
import React, {
  ButtonHTMLAttributes,
  HTMLProps,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
  forwardRef,
  useContext,
  useState,
} from 'react'
import { Input, InputProps } from './shared/Input/Input'
import { Menu, MenuProps } from './shared/Menu/Menu'

import { helperStyles } from '@island.is/island-ui/theme'
import { TestSupport } from '@island.is/island-ui/utils'
import cn from 'classnames'
import { ControllerStateAndHelpers } from 'downshift/typings'
import { ColorSchemeContext } from '../context'
import { Icon } from '../IconRC/Icon'
import { ErrorMessage } from '../Input/ErrorMessage'
import { Item } from './shared/Item/Item'
import { Label } from './shared/Label/Label'

export type AsyncSearchSizes = 'medium' | 'large' | 'semi-large'

export type ItemCmpProps = {
  active?: boolean
  selected?: boolean
  colored?: boolean
  white?: boolean
}

export type AsyncSearchOption = {
  label: string
  value: string
  component?: (props: ItemCmpProps) => ReactElement
  disabled?: boolean
}

export interface AsyncSearchProps {
  id?: string
  label?: string
  ariaLabel?: string
  placeholder?: string
  options: AsyncSearchOption[]
  colored?: boolean
  showDividerIfActive?: boolean
  filter?: boolean | ((x: AsyncSearchOption) => boolean)
  inputValue?: string
  initialInputValue?: string
  size?: AsyncSearchSizes
  loading?: boolean
  closeMenuOnSubmit?: boolean
  openMenuOnFocus?: boolean
  required?: boolean
  errorMessage?: string
  hasError?: boolean
  white?: boolean
  onSubmit?: (
    inputValue: string,
    selectedOption: AsyncSearchOption | null,
  ) => void
  onChange?: DownshiftProps<AsyncSearchOption>['onChange']
  onInputValueChange?: DownshiftProps<AsyncSearchOption>['onInputValueChange']
}

export const AsyncSearch = forwardRef<HTMLInputElement, AsyncSearchProps>(
  (
    {
      id = 'asyncsearch-id',
      label,
      ariaLabel,
      placeholder,
      size = 'medium',
      colored,
      options,
      errorMessage,
      hasError = errorMessage !== undefined,
      filter = false,
      loading,
      inputValue,
      initialInputValue,
      white,
      required,
      closeMenuOnSubmit,
      openMenuOnFocus,
      onChange,
      onSubmit,
      onInputValueChange,
      showDividerIfActive,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState<boolean>(false)
    const { colorScheme } = useContext(ColorSchemeContext)

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const hasLabel = Boolean(size === 'large' && label)
    const whiteColorScheme = colorScheme === 'white' || white
    return (
      <Downshift
        id={id}
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
        itemToString={(item: AsyncSearchOption | null) =>
          item ? item.label : ''
        }
        inputValue={inputValue}
        {...props}
      >
        {(downshiftProps: ControllerStateAndHelpers<AsyncSearchOption>) => {
          const {
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            openMenu,
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
                key={item.value}
                highlightedIndex={highlightedIndex}
                isActive={highlightedIndex === index}
                showDividerIfActive={showDividerIfActive}
                colored={colored}
                size={size === 'semi-large' ? 'medium' : size}
                item={item}
                {...getItemProps({
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
              onSubmit && onSubmit(inputValue || '', selectedOption)
            }
          }

          let inputColor: InputProps['color'] | undefined = undefined
          if (whiteColorScheme) {
            inputColor = 'white'
          } else if (colorScheme === 'blueberry') {
            inputColor = 'blueberry'
          } else if (colorScheme === 'dark') {
            inputColor = 'dark'
          } else if (colorScheme === 'blue') {
            inputColor = 'blue'
          }

          return (
            <AsyncSearchInput
              hasFocus={focused}
              loading={loading}
              hasError={hasError}
              errorMessage={errorMessage}
              rootProps={getRootProps(
                { refKey: 'ref' },
                { suppressRefError: true },
              )}
              inputProps={{
                ...getInputProps({
                  value: inputValue,
                  onFocus: () => {
                    onFocus()
                    if (openMenuOnFocus) {
                      openMenu()
                    }
                  },
                  onBlur,
                  ref,
                  spellCheck: true,
                  ...(onSubmit && { onKeyDown }),
                }),
                inputSize: size,
                isOpen: shouldShowItems,
                colored,
                hasLabel,
                placeholder,
                color: inputColor,
              }}
              buttonProps={{
                onFocus,
                onBlur,
                'aria-label': ariaLabel,
                ...(onSubmit
                  ? {
                      onClick: () => {
                        closeMenuOnSubmit && closeMenu()
                        onSubmit && onSubmit(inputValue || '', null)
                      },
                    }
                  : getToggleButtonProps()),
              }}
              label={label}
              required={required}
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
  inputValue: string | null,
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

const getIconColor = (
  whiteColorScheme: boolean,
  blueberryColorScheme: boolean,
  darkColorScheme: boolean,
) => {
  if (whiteColorScheme) {
    return 'white'
  }
  if (blueberryColorScheme) {
    return 'blueberry600'
  }
  if (darkColorScheme) {
    return 'dark400'
  }
  return 'blue400'
}

export interface AsyncSearchInputProps {
  hasFocus: boolean
  rootProps?: HTMLProps<HTMLDivElement>
  inputProps: InputProps
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>
  menuProps?: Partial<MenuProps>
  white?: boolean
  hasError?: boolean
  required?: boolean
  label?: string
  errorMessage?: string
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  loading?: boolean
  children?: ReactNode
  skipContext?: boolean
}

export const AsyncSearchInput = forwardRef<
  HTMLInputElement,
  AsyncSearchInputProps & TestSupport
>(
  (
    {
      hasFocus,
      rootProps,
      inputProps,
      buttonProps,
      loading = false,
      white = false,
      label,
      hasError,
      labelProps = {},
      required,
      menuProps = {},
      children,
      errorMessage,
      skipContext,
      dataTestId,
    },
    ref,
  ) => {
    const { colorScheme: colorSchemeContext } = useContext(ColorSchemeContext)
    const { value, inputSize: size } = inputProps
    const showLabel = Boolean(label)
    const isOpen = hasFocus && !!children && React.Children.count(children) > 0

    const whiteColorScheme = skipContext
      ? false
      : colorSchemeContext === 'white' || white

    const blueberryColorScheme = skipContext
      ? false
      : colorSchemeContext === 'blueberry'

    const darkColorScheme = skipContext ? false : colorSchemeContext === 'dark'

    const blueColorScheme = skipContext ? false : colorSchemeContext === 'blue'

    const iconColor = getIconColor(
      whiteColorScheme,
      blueberryColorScheme,
      darkColorScheme,
    )

    let inputColor: InputProps['color'] | undefined = undefined

    if (whiteColorScheme) {
      inputColor = 'white'
    } else if (blueberryColorScheme) {
      inputColor = 'blueberry'
    } else if (darkColorScheme) {
      inputColor = 'dark'
    }

    const normalizedSize = size === 'semi-large' ? 'medium' : size
    return (
      <>
        <div
          {...rootProps}
          className={cn(styles.wrapper, {
            [styles.focused]: hasFocus || isOpen,
            [styles.open]: isOpen,
            [styles.white]: whiteColorScheme,
            [styles.hasError]: hasError,
          })}
        >
          <Input
            {...inputProps}
            colored={inputProps.colored || blueColorScheme}
            data-testid={dataTestId}
            color={inputColor}
            isOpen={isOpen}
            ref={ref}
            hasError={hasError}
            placeholder={value ? undefined : inputProps.placeholder}
          />
          {!loading ? (
            <button
              className={cn(styles.icon, styles.iconSizes[normalizedSize], {
                [styles.transparentBackground]:
                  whiteColorScheme ||
                  blueberryColorScheme ||
                  darkColorScheme ||
                  blueColorScheme,
                [styles.focusable]: value,
              })}
              tabIndex={value ? 0 : -1}
              {...buttonProps}
            >
              <Icon size={normalizedSize} icon={'search'} color={iconColor} />
            </button>
          ) : (
            <span
              className={cn(
                styles.loadingIcon,
                styles.loadingIconSizes[normalizedSize],
              )}
              aria-hidden="false"
              aria-label="Loading"
            >
              <Icon icon="reload" color={iconColor} />
            </span>
          )}
          {showLabel && (
            <Label {...labelProps} hasError={hasError}>
              {label}
              {required && (
                <span aria-hidden="true" className={inputStyles.isRequiredStar}>
                  {' '}
                  *
                </span>
              )}
            </Label>
          )}
          {!showLabel && (
            <label
              className={helperStyles.srOnly}
              id={inputProps['aria-labelledby']}
            >
              {inputProps.placeholder}
            </label>
          )}
          <Menu
            colorScheme={blueColorScheme ? 'blue' : undefined}
            {...{ isOpen, shouldShowItems: isOpen, ...menuProps }}
          >
            {children}
          </Menu>
        </div>
        {hasError && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </>
    )
  },
)
