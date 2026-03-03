import { useIntl } from 'react-intl'

import { Box, Button, Icon, Text } from '@island.is/island-ui/core'

import { m } from '../../messages/messages'
import * as styles from './Footer.css'

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
          <Button
            variant="ghost"
            size="medium"
            colorScheme="negative"
            icon="open"
            iconType="outline"
            fluid
            onClick={() =>
              window.open(
                'https://innritun.is/',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            {formatMessage(m.general.innritun)}
          </Button>
          <Button
            variant="ghost"
            size="medium"
            colorScheme="negative"
            icon="open"
            iconType="outline"
            fluid
            onClick={() =>
              window.open(
                'https://naestaskref.is',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            {formatMessage(m.general.nextStep)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
