import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

export const LoadingIcon = () => {
  const { color, isDark } = useTheme()

  return (
    <ActivityIndicator
      size="small"
      color={isDark ? color.white : color.blue400}
    />
  )
}
