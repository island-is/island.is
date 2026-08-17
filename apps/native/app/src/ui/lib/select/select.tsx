import React, { useState } from 'react'
import { SelectionMenu } from 'react-native-platform-components'
import styled, { css } from 'styled-components/native'

import chevronDown from '../../assets/icons/chevron-down.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

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
}

export const Select = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  disabled = false,
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <>
      <Host disabled={disabled} onPress={() => setOpen(true)}>
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
          setOpen(false)
        }}
        onRequestClose={() => setOpen(false)}
      />
    </>
  )
}
