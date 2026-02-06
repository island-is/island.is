import { useIntl } from 'react-intl'
import { ImageSourcePropType, View } from 'react-native'
import { useTheme } from 'styled-components'
import { Typography } from '../../ui'
import { LinkContainer } from '../external-links/external-links'

export interface MoreInfoConteinerProps {
  externalLinks: {
    link: string
    title: string
    icon?: ImageSourcePropType
  }[]
  componentId: string
}
export const MoreInfoContiner = ({
  externalLinks,
  componentId,
}: MoreInfoConteinerProps) => {
  const theme = useTheme()
  const intl = useIntl()

  return (
    <View
      style={{
        borderTopColor: theme.color.blue200,
      }}
    >
      <Typography variant="heading5">
        {intl.formatMessage({ id: 'profile.moreInfo' })}
      </Typography>
      <View style={{ marginHorizontal: -16 }}>
        {externalLinks.map((link) => (
          <LinkContainer
            links={{
              ...link,
              isExternal: true,
            }}
            key={link.title}
            componentId={componentId}
          />
        ))}
      </View>
    </View>
  )
}
