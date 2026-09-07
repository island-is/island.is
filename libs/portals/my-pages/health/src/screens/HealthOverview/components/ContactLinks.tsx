import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'
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
  icon: IconMapIcon
}

const ContactLinks = () => {
  const { formatMessage } = useLocale()

  const links: ContactLinkItem[] = [
    {
      title: formatMessage(messages.contactChat),
      description: formatMessage(messages.contactChatDesc),
      href: formatMessage(messages.heilsuveraChatLink),
      icon: 'open',
    },
    {
      title: formatMessage(messages.contactSendMessage),
      description: formatMessage(messages.contactSendMessageDesc),
      href: HealthPaths.HealthConversationsNew,
      icon: 'arrowForward',
    },
  ]

  const renderDescription = (link: ContactLinkItem) => (
    <>
      <Text variant="medium" fontWeight="light" lineHeight="md" color="dark400">
        {link.description}
      </Text>
      {link.emergencyDescription ? (
        <Text
          variant="medium"
          fontWeight="light"
          lineHeight="md"
          color="red600"
        >
          {link.emergencyDescription}
        </Text>
      ) : null}
    </>
  )

  const renderRowContent = (link: ContactLinkItem) => (
    <LinkResolver href={link.href} className={styles.rowLink}>
      <Box paddingX={3} paddingY={2} width="full">
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="flexStart"
          columnGap={2}
          style={{ marginBottom: 4 }}
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
          </Box>
          <Box
            flexShrink={0}
            display="flex"
            style={{ minWidth: 16, minHeight: 16, alignItems: 'center' }}
          >
            <Icon
              icon={link.icon}
              type="outline"
              color="blue400"
              size="small"
            />
          </Box>
        </Box>
        {renderDescription(link)}
      </Box>
    </LinkResolver>
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
          {renderRowContent(link)}
        </Box>
      ))}
    </Box>
  )
}

export default ContactLinks
