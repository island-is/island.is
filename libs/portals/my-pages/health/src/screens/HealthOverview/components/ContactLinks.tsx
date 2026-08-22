import React from 'react'
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
      <Text variant="medium" fontWeight="light" lineHeight="lg" color="dark400">
        {link.description}
      </Text>
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
    </>
  )

  const renderLink = (link: ContactLinkItem, children: React.ReactNode) =>
    link.href.startsWith('tel:') ? (
      <a href={link.href} className={styles.telLink}>
        {children}
      </a>
    ) : (
      <LinkResolver href={link.href}>{children}</LinkResolver>
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
        {renderLink(
          link,
          <Text
            variant="medium"
            fontWeight="semiBold"
            lineHeight="lg"
            color="blue400"
            className={styles.titleText}
          >
            {link.title}
          </Text>,
        )}
        {renderDescription(link)}
      </Box>
      <Box
        flexShrink={0}
        marginLeft={2}
        display="flex"
        style={{ minWidth: 16, minHeight: 16, alignItems: 'center' }}
      >
        {renderLink(
          link,
          <Icon icon={link.icon} type="outline" color="blue400" size="small" />,
        )}
      </Box>
    </Box>
  )

  return (
    <>
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
      <Box
        borderWidth="standard"
        borderColor="blue200"
        borderRadius="large"
        background="white"
        paddingX={3}
        paddingY={3}
        marginTop={3}
      >
        <Text variant="h5" as="h3" lineHeight="lg">
          {formatMessage(messages.contactNow)}
        </Text>
        <Text
          variant="medium"
          fontWeight="light"
          lineHeight="lg"
          color="dark400"
        >
          {formatMessage(messages.contactNowDesc)}
        </Text>
        <Text
          variant="medium"
          fontWeight="light"
          lineHeight="lg"
          color="red600"
        >
          {formatMessage(messages.contactNowEmergencyDesc)}
        </Text>
      </Box>
    </>
  )
}

export default ContactLinks
