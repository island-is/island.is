import React from 'react'
import { useIntl } from 'react-intl'

import { Box, GridContainer, Icon, Text } from '@island.is/island-ui/core'

import { m } from '../../messages/messages'
import * as styles from './Footer.css'

export const Footer = () => {
  const { formatMessage } = useIntl()

  return (
    <Box width="full" paddingY={5}>
      <GridContainer>
        <Box className={styles.footer}>
          <Box className={styles.footerContent}>
            {/* Logo and ministry name */}
            <Box display="flex" alignItems="center" columnGap={2}>
              <img
                src="/assets/skjaldarmerki.svg"
                alt={formatMessage(m.footer.logoAlt)}
                className={styles.logo}
              />
              <Box
                style={{ borderLeft: 'solid 1px white' }}
                paddingLeft={4}
                alignItems={'baseline'}
              >
                <Text variant="eyebrow" color="white">
                  {formatMessage(m.footer.government)}
                </Text>
                <Text variant="small" color="white">
                  {formatMessage(m.footer.ministry)}
                </Text>
              </Box>
              {/* Links */}
              <Box
                className={styles.linksSection}
                display={'flex'}
                flexDirection={'column'}
                rowGap={0}
                style={{ borderLeft: 'solid 1px white' }}
                paddingLeft={4}
              >
                <Text variant="small" color="white">
                  {formatMessage(m.footer.website)}
                </Text>
                <Box display="flex" columnGap={1}>
                  <Box display={'flex'} columnGap={1} alignItems={'center'}>
                    <Icon
                      icon="mail"
                      color="white"
                      type="outline"
                      size="small"
                    />
                    <Text variant="small" color="white">
                      {formatMessage(m.footer.email)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </Box>
  )
}
