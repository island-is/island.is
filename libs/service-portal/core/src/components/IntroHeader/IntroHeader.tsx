import {
  IntroHeader as IntroHeaderBase,
  IntroHeaderProps,
} from '@island.is/portals/core'

export const IntroHeader = (props: Omit<IntroHeaderProps, 'children'>) => {
  const { marginBottom } = props

  return (
    <IntroHeaderBase
      {...props}
      marginBottom={marginBottom ? marginBottom : [0, 0, 2]}
    />
  )
}

export default IntroHeader
