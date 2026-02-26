import { Pressable, TextStyle, View } from 'react-native'
import { Icon, theme, Typography } from '../../ui'
import { ImageSourcePropType } from 'react-native'
import externalLinkIcon from '../../assets/icons/external-link.png'
import { useBrowser } from '../../hooks/use-browser'
import styled from 'styled-components/native'

export interface ExternalLinkItem {
  link: string
  title: string
  icon?: ImageSourcePropType
}

export interface ExternalLinksProps {
  links: ExternalLinkItem
  fontWeight?: TextStyle['fontWeight']
  borderBottom?: boolean
  fontSize?: number
}

const Container = styled(Pressable)<{ $hasBorder: boolean }>(
  ({ $hasBorder, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    borderBottomColor: theme.color.blue200,
    borderBottomWidth: $hasBorder ? 1 : 0,
    padding: theme.spacing[2],
  }),
)

const Content = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing[2],
}))

const IconWrapper = styled(View)(({ theme }) => ({
  height: 42,
  width: 42,
  borderRadius: 21,
  backgroundColor: theme.color.blue100,
  alignItems: 'center',
  justifyContent: 'center',
}))

export const ExternalLink = ({
  links,
  fontWeight = '300',
  borderBottom = true,
  fontSize = 16,
}: ExternalLinksProps) => {
  const { openBrowser } = useBrowser()

  const handlePress = () => {
    openBrowser(links.link)
  }

  return (
    <Container onPress={handlePress} $hasBorder={borderBottom}>
      <Content>
        {links.icon && (
          <IconWrapper>
            <Icon source={links.icon} width={24} height={24} />
          </IconWrapper>
        )}
        <Typography
          lineHeight={24}
          weight={fontWeight}
          color={theme.color.dark400}
          size={fontSize}
        >
          {links.title}
        </Typography>
      </Content>
      <Icon
        source={externalLinkIcon}
        tintColor="dark300"
        width={20}
        height={20}
      />
    </Container>
  )
}
