import React, { useRef } from 'react'
import {
  ActivityIndicator,
  TextInput,
  TextInputProps,
  View,
} from 'react-native'
import styled, { css, useTheme } from 'styled-components/native'
import { dynamicColor, font } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]}px;
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
  background-color: ${dynamicColor((props) => ({
    dark: 'shade300',
    light: props.theme.color.blue100,
  }))};
`

const Label = styled(Typography)<{ readOnly: boolean }>`
  color: ${dynamicColor((props) => ({
    dark: 'foreground',
    light: props.theme.color.blue400,
  }))};
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
  ${({ readOnly }) =>
    readOnly &&
    css`
      color: ${({ theme }) => theme.color.dark400};
    `}
`

const Input = styled(TextInput)<{
  value: string
  disabled: boolean
  readOnly: boolean
}>`
  padding-left: ${({ theme }) => theme.spacing[1]}px;
  padding-top: 0px;
  padding-bottom: 0px;

  color: ${({ theme, readOnly }) =>
    readOnly ? theme.color.dark400 : theme.color.blue400};

  ${font({
    fontSize: 16,
    lineHeight: 20,
    fontWeight: ({ value }) => (value === '' ? 400 : 600),
  })}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`

type TIProps = Omit<TextInputProps, 'onChange'>

interface TextFieldProps extends TIProps {
  label: string
  value: string
  onChange?: (e: string) => void
  disabled?: boolean
  loading?: boolean
  errorMessage?: string
}

export const TextField = ({
  label,
  onChange,
  value,
  style,
  disabled = false,
  loading = false,
  errorMessage,
  readOnly = false,
  ...rest
}: TextFieldProps) => {
  const theme = useTheme()
  const inputRef = useRef<TextInput>(null)

  return (
    <View>
      <Host onPress={() => inputRef.current?.focus()} style={style as any}>
        <View>
          <Label readOnly={readOnly} variant="eyebrow">
            {label}
          </Label>
          <Input
            disabled={disabled}
            onChangeText={onChange}
            value={value}
            ref={inputRef}
            readOnly={readOnly}
            {...rest}
          />
        </View>
        {loading && (
          <View style={{ height: 20, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
      </Host>
      {errorMessage && (
        <Typography
          variant="body3"
          color={theme.color.red600}
          style={{ marginTop: theme.spacing.smallGutter }}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  )
}
