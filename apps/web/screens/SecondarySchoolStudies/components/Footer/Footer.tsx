import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  GridContainer,
  Icon,
  Text,
} from '@island.is/island-ui/core'

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

            {/* Buttons */}
            <Box className={styles.buttonsSection}>
              <Button
                variant="ghost"
                size="small"
                colorScheme="negative"
                icon="open"
                iconType="outline"
                onClick={() =>
                  window.open(
                    'https://naestaskref.is/is',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                {formatMessage(m.general.innritun)}
              </Button>
              <Button
                variant="ghost"
                size="small"
                colorScheme="negative"
                icon="open"
                iconType="outline"
                onClick={() =>
                  window.open(
                    'https://island.is/umsokn-um-framhaldsskola',
                    '_blank',
                  )
                }
              >
                {formatMessage(m.general.nextStep)}
              </Button>
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </Box>
  )
}
