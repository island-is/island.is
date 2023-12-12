import { Box, Text, ButtonProps, TextProps } from '@island.is/island-ui/core'

export type Props = {
  children?: React.ReactElement<TextProps>
  button?: React.ReactElement<ButtonProps>
}

export const FormHeader = ({ children, button }: Props) => {
  if (!children && !button) {
    return null
  }

  const align =
    children && button ? 'spaceBetween' : children ? 'flexStart' : 'flexEnd'

  return (
    <Box
      display="flex"
      marginBottom={4}
      alignItems="center"
      justifyContent={align}
    >
      {children}
      {button}
    </Box>
  )
}
