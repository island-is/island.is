import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'
import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { useOrganizationsStore } from '../../../stores/organizations-store'
import { Container, Icon, Typography } from '../../../ui'
import { Markdown } from '../../../ui/lib/markdown/markdown'
import { isAndroid } from '../../../utils/devices'
import { getInitials } from '../../../utils/get-initials'

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
  width: 42px;
  height: 42px;
  background-color: ${({ theme }) => theme.color.blue100};
  border-radius: ${({ theme }) => theme.border.radius.full};
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  row-gap: 2px;
`

type DocumentListItemProps = {
  sender: string
  title: string
  body?: string
  date?: string
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
        <>
          <Host>
            <IconBackground>
              {!source ? (
                <Typography
                  variant="body"
                  weight="600"
                  lineHeight={0}
                  color={theme.color.blue400}
                >
                  {getInitials(sender)}
                </Typography>
              ) : (
                <Icon source={source} width={24} height={24} />
              )}
            </IconBackground>
            <Content>
              <Typography variant="eyebrow">{title}</Typography>
              <Typography variant="body3">{date}</Typography>
            </Content>
          </Host>
          <Animated.View style={bodyStyle}>
            <Body
              onLayout={(e) => {
                height.value = e.nativeEvent.layout.height
              }}
            >
              <Markdown>{body}</Markdown>
            </Body>
          </Animated.View>
        </>
      </Wrapper>
    </Animated.View>
  )
}
