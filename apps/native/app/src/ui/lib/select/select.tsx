import React, { useState } from 'react'
import { Modal } from 'react-native'
import styled, { css, useTheme } from 'styled-components/native'

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

const Backdrop = styled.Pressable`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]}px;
  background-color: rgba(0, 0, 0, 0.4);
`

const OptionList = styled.View`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${dynamicColor((props) => ({
    dark: 'shade100',
    light: props.theme.color.white,
  }))};
`

const Option = styled.Pressable<{ borderTop: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-top-width: ${({ theme, borderTop }) =>
    borderTop ? theme.border.width.hairline : 0}px;
  border-top-color: ${dynamicColor(
    (props) => ({
      dark: 'shade300',
      light: props.theme.color.blue200,
    }),
    true,
  )};
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
  const theme = useTheme()
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
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Backdrop onPress={() => setOpen(false)}>
          <OptionList>
            {options.map((option, index) => (
              <Option
                key={option.value}
                borderTop={index !== 0}
                onPress={() => {
                  onSelect(option.value)
                  setOpen(false)
                }}
              >
                <Typography
                  variant={option.value === value ? 'heading5' : 'body'}
                  color={
                    option.value === value ? theme.color.blue400 : undefined
                  }
                >
                  {option.label}
                </Typography>
              </Option>
            ))}
          </OptionList>
        </Backdrop>
      </Modal>
    </>
  )
}
