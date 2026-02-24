import { ImageSourcePropType, Pressable, TextStyle, View } from 'react-native'
import externalLinkIcon from '../../assets/icons/external-link.png'
import cheveronForwardIcon from '../../assets/icons/chevron-forward.png'
import styled from 'styled-components/native'
import { useBrowser } from '../../lib/use-browser'
import { Icon, theme, Typography } from '../../ui'
import { useDropdownOverlay } from '../dropdown/dropdown-overlay-context'
import { navigateTo } from '../../lib/deep-linking'
import { Href, useRouter } from 'expo-router'

export interface LinkItem {
  link: Href | string
  title: string
  icon?: ImageSourcePropType
  isExternal?: boolean
  tabId?: string
}

export interface LinkRowButtonProps {
  link: LinkItem
  fontWeight?: TextStyle['fontWeight']
  borderBottom?: boolean
  fontSize?: number
  subLinks?: LinkItem[]
  isSubLink?: boolean
}

const ICON_SIZE = 42

const Host = styled(View)<{ $hasBorder: boolean }>(({ theme, $hasBorder }) => ({
  flexDirection: 'column',
  width: '100%',
  ...($hasBorder && {
    borderBottomColor: theme.color.blue200,
    borderBottomWidth: 1,
  }),
}))

const SubLinksContainer = styled(View)(({ theme }) => ({
  flexDirection: 'column',
  marginBottom: theme.spacing[2],
  marginLeft: theme.spacing[2] + ICON_SIZE / 2,
  borderLeftWidth: 1,
  paddingLeft: theme.spacing[2] + ICON_SIZE / 2,
  borderLeftColor: theme.color.blue200,
  gap: theme.spacing[2],
}))

const Container = styled(Pressable)<{ hasIcon: boolean; isSubLink: boolean }>(
  ({ theme, hasIcon, isSubLink }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    ...(isSubLink
      ? {
          paddingRight: theme.spacing[2],
          paddingVertical: theme.spacing.smallGutter,
        }
      : {
          paddingVertical: hasIcon ? theme.spacing.p2 : theme.spacing[2],
          paddingHorizontal: theme.spacing[2],
        }),
  }),
)

const Content = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing[2],
}))

const IconWrapper = styled(View)(({ theme }) => ({
  height: ICON_SIZE,
  width: ICON_SIZE,
  borderRadius: ICON_SIZE / 2,
  backgroundColor: theme.color.blue100,
  alignItems: 'center',
  justifyContent: 'center',
}))

export const LinkRowButton = ({
  link,
  fontWeight = '300',
  borderBottom = true,
  fontSize = 16,
  subLinks,
  isSubLink = false,
}: LinkRowButtonProps) => {
  const { openBrowser } = useBrowser()
  const overlay = useDropdownOverlay()
  const router = useRouter()

  const handlePress = () => {
    if (overlay?.componentId) {
      overlay.close()
    }

    if (link.isExternal) {
      openBrowser(link.link as string)
    } else {
      router.navigate(link.link as Href)
    }
  }

  return (
    <Host $hasBorder={borderBottom}>
      <Container
        onPress={handlePress}
        hasIcon={!!link.icon}
        isSubLink={isSubLink}
      >
        <Content>
          {link.icon && (
            <IconWrapper>
              <Icon source={link.icon} width={ICON_SIZE} height={ICON_SIZE} />
            </IconWrapper>
          )}
          <Typography
            lineHeight={ICON_SIZE}
            weight={fontWeight}
            color={theme.color.dark400}
            size={fontSize}
          >
            {link.title}
          </Typography>
        </Content>
        <Icon
          source={link.isExternal ? externalLinkIcon : cheveronForwardIcon}
          tintColor="dark300"
          width={20}
          height={20}
        />
      </Container>
      {subLinks && (
        <SubLinksContainer>
          {subLinks.map((subLink) => (
            <LinkRowButton
              link={{
                link: subLink.link,
                title: subLink.title,
                icon: subLink.icon,
                isExternal: subLink.isExternal,
                tabId: subLink.tabId,
              }}
              key={subLink.title}
              borderBottom={false}
              isSubLink={true}
            />
          ))}
        </SubLinksContainer>
      )}
    </Host>
  )
}
