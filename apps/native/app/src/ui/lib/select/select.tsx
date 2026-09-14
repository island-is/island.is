import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { SelectionMenu } from 'react-native-platform-components'
import styled, { css } from 'styled-components/native'

import chevronDown from '../../assets/icons/chevron-down.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Wrapper = styled.View``

const Host = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: 1px;
  border-style: solid;
  border-color: ${dynamicColor(
    (props) => ({
      dark: 'shade500',
      light: props.theme.color.blue200,
    }),
    true,
  )};
  padding: ${({ theme }) => theme.spacing[1]}px
    ${({ theme }) => theme.spacing[2]}px;
  background-color: ${dynamicColor((props) => ({
    dark: 'shade300',
    light: props.theme.color.blue100,
  }))};
`

const Content = styled.View`
  flex: 1;
`

const Label = styled(Typography)`
  color: ${dynamicColor((props) => ({
    dark: 'foreground',
    light: props.theme.color.blue400,
  }))};
`

const Value = styled(Typography)<{ isPlaceholder: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  ${({ isPlaceholder }) =>
    isPlaceholder &&
    css`
      color: ${dynamicColor((props) => ({
        dark: 'rgba(255, 255, 255, 0.6)',
        light: props.theme.color.dark300,
      }))};
    `}
`

const Chevron = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  tint-color: ${dynamicColor((props) => ({
    dark: 'foreground',
    light: props.theme.color.blue400,
  }))};
`

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  label: string
  value?: string
  options: SelectOption[]
  onSelect: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /**
   * Notified whenever the menu opens or closes. The platform presents the menu
   * in its own view controller which is not torn down with the React tree, so
   * screens that can be dismissed by gesture need to know it is up.
   */
  onOpenChange?: (open: boolean) => void
}

export const Select = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  disabled = false,
  onOpenChange,
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  const changeOpen = useCallback(
    (next: boolean) => {
      setOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange],
  )

  // The platform presents the menu itself and does not tear it down when this
  // component unmounts, so a menu still open when the screen goes away stays
  // presented and bleeds over whatever is shown next. Close it on the way out,
  // while we are still mounted and can tell native to dismiss.
  useFocusEffect(
    useCallback(() => {
      return () => {
        changeOpen(false)
      }
    }, [changeOpen]),
  )

  return (
    <Wrapper>
      <Host disabled={disabled} onPress={() => changeOpen(true)}>
        <Content>
          <Label variant="eyebrow">{label}</Label>
          <Value
            variant="heading5"
            weight={selected ? undefined : '400'}
            isPlaceholder={!selected}
            numberOfLines={1}
          >
            {selected?.label ?? placeholder ?? ''}
          </Value>
        </Content>
        {!disabled && <Chevron source={chevronDown} />}
      </Host>
      <SelectionMenu
        presentation="modal"
        visible={open}
        placeholder={placeholder ?? label}
        options={options.map((option) => ({
          label: option.label,
          data: option.value,
        }))}
        selected={value ?? null}
        onSelect={(data) => {
          onSelect(data)
          changeOpen(false)
        }}
        onRequestClose={() => changeOpen(false)}
      />
    </Wrapper>
  )
}
