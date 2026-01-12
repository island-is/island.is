import { ActivityIndicator, View } from 'react-native'
import { useTheme } from 'styled-components'
import { isAndroid } from '../../utils/devices'

export const LoadingIcon = () => {
  const { color, spacing } = useTheme()

  return (
    <View
      style={{
        marginRight: spacing[1],
        marginLeft: spacing[1],
      }}
    >
      <ActivityIndicator
        size="small"
        color={color.blue400}
        {...(isAndroid && {
          style: { marginVertical: spacing[1], paddingRight: spacing[1] },
        })}
      />
    </View>
  )
}
