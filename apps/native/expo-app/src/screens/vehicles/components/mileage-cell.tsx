import { useIntl } from 'react-intl'
import { Image, Pressable, View } from 'react-native'

import { Skeleton, Typography, useDynamicColor } from '../../../ui'
import clock from '../../../assets/icons/clock.png'

export function MileageCell({
  title,
  subtitle,
  accessory,
  editable,
  onPress,
  skeleton,
}: {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  accessory?: React.ReactNode
  editable?: boolean
  onPress?(): void
  skeleton?: boolean
}) {
  const intl = useIntl()
  const dynamicColor = useDynamicColor()
  if (skeleton) {
    return (
      <Skeleton
        active
        height={68}
        style={{
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
    )
  }
  return (
    <Pressable onPress={editable ? onPress : undefined}>
      <View
        style={{
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: dynamicColor({
            light: editable ? '#FFFCE0' : dynamicColor.theme.color.blueberry100,
            dark: editable
              ? dynamicColor.theme.shades.dark.shade400
              : dynamicColor.theme.shades.dark.shade100,
          }),
          gap: 4,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Typography weight="600" style={{ flex: 1 }}>
            {title}
          </Typography>
          {editable && (
            <Typography
              color={dynamicColor({
                light: dynamicColor.theme.color.blue400,
                dark: dynamicColor.theme.color.blue400,
              })}
              weight="600"
              size={12}
            >
              {intl.formatMessage({ id: 'vehicle.mileage.editRecordButton' })}
            </Typography>
          )}
          {editable && <Image source={clock} style={{ marginLeft: 4 }} />}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography>{subtitle}</Typography>
          <Typography weight="600">{accessory}</Typography>
        </View>
      </View>
    </Pressable>
  )
}
