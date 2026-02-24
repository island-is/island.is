import { DynamicColorIOS, Platform } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Button, ButtonProps, blue400 } from '@/ui'

export const SelectButton = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      {...props}
      isOutlined
      iconStyle={{
        tintColor: props.disabled ? '#999' : blue400,
      }}
      style={{
        borderColor: props.disabled
          ? 'rgba(128,128,128,0.25)'
          : Platform.OS === 'ios'
          ? DynamicColorIOS({
              dark: theme.shades.dark.shade300,
              light: theme.color.blue200,
            })
          : theme.colorScheme === 'dark'
          ? theme.shades.dark.shade300
          : theme.color.blue200,
        paddingTop: 8,
        paddingBottom: 8,
        minWidth: 0,
        minHeight: 40,
        backgroundColor: theme.color.blue100,
      }}
      textProps={{
        lineBreakMode: 'tail',
        numberOfLines: 1,
      }}
      textStyle={{
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '500',
        color: props.disabled
          ? '#999'
          : Platform.OS === 'ios'
          ? DynamicColorIOS({
              dark: theme.shades.dark.foreground,
              light: theme.shades.light.foreground,
            })
          : theme.colorScheme === 'dark'
          ? theme.shades.dark.foreground
          : theme.shades.light.foreground,
        ...props.textStyle,
      }}
    />
  )
}
