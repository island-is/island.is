import {
  Box,
  Divider,
  Stack,
  StackProps,
  UseBoxStylesProps,
} from '@island.is/island-ui/core'

interface Props extends Omit<StackProps, 'dividers'> {
  box?: Omit<UseBoxStylesProps, 'component'>
}

export const StackWithBottomDivider = (props: Props) => {
  const { box, ...otherProps } = props
  return (
    <Box {...box}>
      <Stack {...otherProps} dividers />
      <Box paddingTop={1}>
        <Divider />
      </Box>
    </Box>
  )
}
