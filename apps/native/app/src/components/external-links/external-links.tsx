import { ImageSourcePropType, Pressable, TextStyle, View } from 'react-native'
import externalLinkIcon from '../../assets/icons/external-link.png'
import cheveronForwardIcon from '../../assets/icons/chevron-forward.png'
import styled from 'styled-components/native'
import { useBrowser } from '../../lib/use-browser'
import { Icon, theme, Typography } from '../../ui'
import { useDropdownOverlay } from '../dropdown/dropdown-overlay-context'
import { navigateTo } from '../../lib/deep-linking'

export interface LinkItem {
  link: string
  title: string
  icon?: ImageSourcePropType
  isExternal?: boolean
}

export interface LinkContainerProps {
  links: LinkItem
  fontWeight?: TextStyle['fontWeight']
  borderBottom?: boolean
  fontSize?: number
  componentId: string
  subLinks?: LinkItem[]
  isSubLink?: boolean
}

const ICON_SIZE = 42;

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

const Container = styled(Pressable)<{ hasIcon: boolean, isSubLink: boolean }>(
  ({ theme, hasIcon, isSubLink }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    ...(isSubLink ? {
      paddingHorizontal: 0,
      paddingVertical: theme.spacing.smallGutter,
    } : {
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

export const LinkContainer = ({
  links,
  fontWeight = '300',
  borderBottom = true,
  fontSize = 16,
  componentId,
  subLinks,
  isSubLink = false,
}: LinkContainerProps) => {
  const { openBrowser } = useBrowser()
  const overlay = useDropdownOverlay()

  const handlePress = () => {
    if (overlay?.componentId) {
      overlay.close()
    }
    if (links.isExternal) {
      openBrowser(links.link, componentId)
    } else {
      navigateTo(links.link, componentId)
    }
  }

  return (
    <Host $hasBorder={borderBottom}>
      <Container onPress={handlePress} hasIcon={!!links.icon} isSubLink={isSubLink}>
        <Content>
          {links.icon && (
            <IconWrapper>
              <Icon source={links.icon} width={ICON_SIZE} height={ICON_SIZE} />
            </IconWrapper>
          )}
          <Typography
            lineHeight={ICON_SIZE}
            weight={fontWeight}
            color={theme.color.dark400}
            size={fontSize}
          >
            {links.title}
          </Typography>
        </Content>
        <Icon
          source={links.isExternal ? externalLinkIcon : cheveronForwardIcon}
          tintColor="dark300"
          width={20}
          height={20}
        />
      </Container>
      {subLinks && (
        <SubLinksContainer>
          {subLinks.map((subLink) => (
            <LinkContainer
              links={{
                link: subLink.link,
                title: subLink.title,
                icon: subLink.icon,
                isExternal: subLink.isExternal,
              }}
              key={subLink.title}
              componentId={componentId}
              borderBottom={false}
              isSubLink={true}
            />
          ))}
        </SubLinksContainer>
      )}
    </Host>
  )
}
