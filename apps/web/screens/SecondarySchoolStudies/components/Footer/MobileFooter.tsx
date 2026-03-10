import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Icon, Text } from '@island.is/island-ui/core'

import { m } from '../../messages/messages'
import * as styles from './Footer.css'

const ButtonLink = Button as React.ComponentType<
  React.ComponentProps<typeof Button> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>

export const MobileFooter = () => {
  const { formatMessage } = useIntl()

  return (
    <Box className={styles.mobileFooter}>
      <Box
        width="full"
        display="flex"
        flexDirection="column"
        rowGap={3}
        alignItems="center"
      >
        {/* Logo and ministry name */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          columnGap={2}
        >
          <img
            src="/assets/skjaldarmerki.svg"
            alt={formatMessage(m.footer.logoAlt)}
            className={styles.logo}
          />
          <Box
            style={{ borderLeft: 'solid 1px white' }}
            paddingLeft={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text variant="eyebrow" color="white">
              {formatMessage(m.footer.government)}
            </Text>
            <Text variant="small" color="white">
              {formatMessage(m.footer.ministry)}
            </Text>
          </Box>
        </Box>

        {/* Links */}
        <Box display="flex" columnGap={2} alignItems="center">
          <Text variant="small" color="white">
            {formatMessage(m.footer.website)}
          </Text>
          <Box
            display="flex"
            alignItems="center"
            columnGap={1}
            style={{ borderLeft: 'solid 1px white' }}
            paddingLeft={2}
          >
            <Icon icon="mail" color="white" type="outline" size="small" />
            <Text variant="small" color="white">
              {formatMessage(m.footer.email)}
            </Text>
          </Box>
        </Box>

        {/* Buttons */}
        <Box
          display="flex"
          flexDirection="column"
          rowGap={2}
          width="full"
          style={{ maxWidth: '265px' }}
        >
          <ButtonLink
            variant="ghost"
            size="medium"
            colorScheme="negative"
            icon="open"
            iconType="outline"
            fluid
            as="a"
            href="https://naestaskref.is"
            target="_blank"
            rel="noopener noreferrer"
          >
            {formatMessage(m.general.nextStep)}
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            size="medium"
            colorScheme="negative"
            icon="open"
            iconType="outline"
            fluid
            as="a"
            href="https://island.is/umsokn-um-framhaldsskola"
            target="_blank"
            rel="noopener noreferrer"
          >
            {formatMessage(m.general.innritun)}
          </ButtonLink>
        </Box>
      </Box>
    </Box>
  )
}
