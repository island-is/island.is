import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

export const LoadingIcon = () => {
  const { color } = useTheme()

  return <ActivityIndicator size="small" color={color.blue400} />
}
