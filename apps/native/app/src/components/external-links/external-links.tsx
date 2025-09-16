import { Pressable, View } from 'react-native'
import { Icon, theme, Typography } from '../../ui'
import { ImageSourcePropType } from 'react-native'
import externalLinkIcon from '../../assets/icons/external-link.png'
import { navigateTo } from '../../lib/deep-linking'

export interface ExternalLinksProps {
  link: string
  title: string
  icon?: ImageSourcePropType
}

export const ExternalLinks = ({ links }: { links: ExternalLinksProps }) => {
  return (
    <Pressable
      onPress={() =>
        navigateTo('/webview', {
          source: { uri: links.link },
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: theme.color.blue200,
        padding: theme.spacing[2],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2],
        }}
      >
        {links.icon && (
          <View
            style={{
              height: 42,
              width: 42,
              borderRadius: 21,
              backgroundColor: theme.color.blue100,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon source={links.icon} width={24} height={24} />
          </View>
        )}
        <Typography
          lineHeight={24}
          weight="300"
          color={theme.color.dark400}
          size={16}
        >
          {links.title}
        </Typography>
      </View>
      <Icon
        source={externalLinkIcon}
        tintColor="dark300"
        width={20}
        height={20}
      />
    </Pressable>
  )
}
