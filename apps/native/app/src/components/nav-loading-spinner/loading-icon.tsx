import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import { isAndroid } from '../../utils/devices'

export const LoadingIcon = () => {
  const { color, spacing } = useTheme()

  return (
    <ActivityIndicator
      size="small"
      color={color.blue400}
      {...(isAndroid && {
        style: { marginVertical: spacing[1], paddingRight: spacing[1] },
      })}
    />
  )
}
