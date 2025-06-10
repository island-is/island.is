import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import styled, { css, useTheme } from 'styled-components/native'
import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { useOrganizationsStore } from '../../../stores/organizations-store'
import { Container, Icon, Typography } from '../../../ui'
import { getInitials } from '../../../utils/get-initials'
import { LayoutChangeEvent } from 'react-native'

export const TOGGLE_ANIMATION_DURATION = 300

const Wrapper = styled(PressableHighlight)<{
  hasTopBorder: boolean
}>`
  flex-direction: column;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;

  ${({ hasTopBorder = false, theme }) =>
    hasTopBorder &&
    css`
      border-top-width: ${theme.border.width.standard}px;
      border-top-color: ${theme.color.blue200};
    `}
`

const Host = styled(Container)`
  align-items: center;
  flex-direction: row;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
`

const Body = styled(Container)`
  position: absolute;
  width: 100%;
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
  onLayoutCallback?: (event: LayoutChangeEvent) => void
}

export const DocumentListItem = ({
  sender,
  title,
  body,
  date,
  closeable = false,
  isOpen = false,
  hasTopBorder = true,
  onLayoutCallback,
}: DocumentListItemProps) => {
  const theme = useTheme()
  const { getOrganizationLogoUrl } = useOrganizationsStore()

  const isExpanded = useSharedValue(isOpen)
  const height = useSharedValue(0)

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration: TOGGLE_ANIMATION_DURATION,
    }),
  )
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
    overflow: 'hidden',
  }))

  const handlePress = () => {
    if (!closeable) {
      return
    }

    isExpanded.value = !isExpanded.value
  }

  const source = getOrganizationLogoUrl(sender, 75, true)

  return (
    <Wrapper
      hasTopBorder={hasTopBorder}
      onPress={handlePress}
      highlightColor={closeable ? theme.shade.shade100 : theme.color.white}
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
              onLayoutCallback?.(e)
            }}
          >
            <Typography variant="body3">{body}</Typography>
          </Body>
        </Animated.View>
      </>
    </Wrapper>
  )
}
