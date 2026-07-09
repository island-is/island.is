import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'
import * as styles from './ContactLinks.css'

type ContactLinkItem = {
  title: string
  description: string
  emergencyDescription?: string
  href: string
}

const ContactLinks = () => {
  const { formatMessage } = useLocale()

  const links: ContactLinkItem[] = [
    {
      title: formatMessage(messages.contactChat),
      description: formatMessage(messages.contactChatDesc),
      href: formatMessage(messages.heilsuveraChatLink),
    },
    {
      title: formatMessage(messages.contactPhone),
      description: formatMessage(messages.contactPhoneDesc),
      emergencyDescription: formatMessage(messages.contactPhoneEmergencyDesc),
      href: `tel:${formatMessage(messages.contactPhoneNumber)}`,
    },
    {
      title: formatMessage(messages.contactSendMessage),
      description: formatMessage(messages.contactSendMessageDesc),
      href: HealthPaths.HealthConversationsNew,
    },
  ]

  const renderDescription = (link: ContactLinkItem) => (
    <Text variant="medium" fontWeight="light" lineHeight="lg" color="dark400">
      {link.description}{' '}
      {link.emergencyDescription ? (
        <Text
          variant="medium"
          fontWeight="light"
          lineHeight="lg"
          color="red600"
        >
          {link.emergencyDescription}
        </Text>
      ) : null}
    </Text>
  )

  const renderRowContent = (link: ContactLinkItem) => (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      paddingX={3}
      paddingY={2}
      width="full"
    >
      <Box flexGrow={1} minWidth={0}>
        <Text
          variant="medium"
          fontWeight="semiBold"
          lineHeight="lg"
          color="blue400"
          className={styles.titleText}
        >
          {link.title}
        </Text>
        {renderDescription(link)}
      </Box>
      <Box
        flexShrink={0}
        marginLeft={2}
        display="flex"
        style={{ minWidth: 16, minHeight: 16, alignItems: 'center' }}
      >
        <Icon icon="arrowForward" color="blue400" size="small" />
      </Box>
    </Box>
  )

  return (
    <Box
      borderWidth="standard"
      borderColor="blue200"
      borderRadius="large"
      background="white"
    >
      {links.map((link, index) => (
        <Box
          key={index}
          borderTopWidth={index > 0 ? 'standard' : undefined}
          borderColor="blue200"
        >
          {link.href.startsWith('tel:') ? (
            <a href={link.href} className={styles.telLink}>
              {renderRowContent(link)}
            </a>
          ) : (
            <LinkResolver href={link.href}>
              {renderRowContent(link)}
            </LinkResolver>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default ContactLinks
