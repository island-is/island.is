import { setStringAsync } from 'expo-clipboard'
import { useEffect } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'
import { PressableHighlight } from '@/components/pressable-highlight/pressable-highlight'
import { useOrganizationsStore } from '@/stores/organizations-store'
import { Avatar, Container, Icon, Typography } from '@/ui'
import copyIcon from '@/ui/assets/icons/copy.png'
import { Markdown } from '@/ui/lib/markdown/markdown'
import { isAndroid } from '@/utils/devices'

export const TOGGLE_ANIMATION_DURATION = 300

const Wrapper = styled(PressableHighlight)<{
  hasTopBorder: boolean
}>(({ theme, hasTopBorder }) => ({
  flexDirection: 'column',
  paddingVertical: theme.spacing[2],
  columnGap: theme.spacing[2],
  ...(hasTopBorder && {
    borderTopWidth: theme.border.width.standard,
    borderTopColor: theme.color.blue200,
  }),
}))

const Host = styled(Container)`
  align-items: center;
  flex-direction: row;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
`

const Body = styled(Container)`
  position: absolute;
  width: 100%;
  height: auto;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
`

const IconBackground = styled.View`
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.color.blue100};
  border-radius: ${({ theme }) => theme.border.radius.full};
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  row-gap: 2px;
`

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const MetaSeparator = styled.View`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.color.blue200};
`

type DocumentListItemProps = {
  sender: string
  title: string
  body?: string
  date?: string
  caseNumber?: string
  caseNumberLabel?: string
  caseNumberCopyLabel?: string
  isOpen?: boolean
  closeable?: boolean
  hasTopBorder?: boolean
  hasBottomBorder?: boolean
}

export const DocumentListItem = ({
  sender,
  title,
  body,
  date,
  caseNumber,
  caseNumberLabel,
  caseNumberCopyLabel,
  closeable = false,
  isOpen = false,
  hasTopBorder = true,
}: DocumentListItemProps) => {
  const theme = useTheme()
  const { getOrganizationLogoUrl } = useOrganizationsStore()

  const height = useSharedValue(0)
  const containerOpacity = useSharedValue(isAndroid ? 1 : 0)
  const isExpanded = useSharedValue(isOpen)
  const shouldAnimate = useSharedValue(false)

  useEffect(() => {
    if (!isAndroid) {
      containerOpacity.value = withTiming(1, { duration: 200 })
    }
  }, [containerOpacity])

  const derivedHeight = useDerivedValue(() => {
    const duration = shouldAnimate.value ? TOGGLE_ANIMATION_DURATION : 0

    return withTiming(height.value * Number(isExpanded.value), { duration })
  })

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
    overflow: 'hidden',
  }))

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (isAndroid) {
      return {}
    }

    return {
      opacity: withTiming(containerOpacity.value, { duration: 100 }),
    }
  })

  const handlePress = () => {
    if (!closeable) {
      return
    }

    shouldAnimate.value = true
    isExpanded.value = !isExpanded.value
  }

  const source = getOrganizationLogoUrl(sender, 75, true)

  return (
    <Animated.View style={containerAnimatedStyle}>
      <Wrapper
        onPress={handlePress}
        highlightColor={closeable ? theme.shade.shade100 : theme.color.white}
        hasTopBorder={hasTopBorder}
      >
        <View>
          <Host>
            {source ? (
              <IconBackground>
                <Icon source={source} width={24} height={24} />
              </IconBackground>
            ) : (
              <Avatar name={sender} isSmall />
            )}
            <Content>
              <Typography variant="heading5">{title}</Typography>
              <MetaRow>
                {date ? <Typography variant="body3">{date}</Typography> : null}
                {caseNumber ? (
                  <>
                    {date ? <MetaSeparator /> : null}
                    <Typography variant="body3">
                      {caseNumberLabel ? `${caseNumberLabel} ` : ''}
                      {caseNumber}
                    </Typography>
                    <TouchableOpacity
                      onPress={() => setStringAsync(`#${caseNumber}`)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={caseNumberCopyLabel}
                    >
                      <Image
                        source={copyIcon}
                        style={{ width: 16, height: 16 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </>
                ) : null}
              </MetaRow>
            </Content>
          </Host>
          <Animated.View style={bodyStyle}>
            <Body
              onLayout={(e) => {
                height.value = e.nativeEvent.layout.height
              }}
            >
              {body ? <Markdown>{body}</Markdown> : null}
            </Body>
          </Animated.View>
        </View>
      </Wrapper>
    </Animated.View>
  )
}
