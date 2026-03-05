import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../../messages/messages'
import * as styles from './Header.css'

export const Header = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      {/* Mobile/tablet header */}
      <Box display={['block', 'block', 'block', 'none']}>
        <GridRow marginBottom={5}>
          <GridColumn span="1/1">
            <Box
              position="relative"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={styles.mobileHeroContainer}
            >
              <img
                width={'100%'}
                src={'/assets/bakgrunnsmynstur_framhaldsskola_tablet.svg'}
                alt=""
              />
              <Box
                position="absolute"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <Box className="rs_read">
                  <Text variant="h1" as="h1" marginBottom={2} color="white">
                    {formatMessage(m.home.title)}
                  </Text>
                  <Text variant="h3" as="h2" color="white">
                    {formatMessage(m.home.subtitle)}
                  </Text>
                </Box>
              </Box>
              <Box
                position="absolute"
                className={styles.mobileCoatOfArms}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={'/assets/skjaldarmerki.svg'}
                  alt="Icelandic coat of arms"
                  className={styles.mobileCoatOfArmsImage}
                />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      {/* Desktop header */}
      <Box display={['none', 'none', 'none', 'block']}>
        <GridContainer>
          <Box>
            <GridRow marginBottom={5}>
              <GridColumn span="1/1">
                <Box
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className={styles.heroContainer}
                >
                  <img
                    src={'/assets/bakgrunnsmynstur_framhaldsskola.svg'}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    position="absolute"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="left"
                  >
                    <Box className="rs_read">
                      <Text variant="h1" as="h1" marginBottom={2} color="white">
                        {formatMessage(m.home.title)}
                      </Text>
                      <Text variant="h3" as="h2" color="white">
                        {formatMessage(m.home.subtitle)}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    position="absolute"
                    className={styles.coatOfArms}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={'/assets/skjaldarmerki.svg'}
                      alt="Icelandic coat of arms"
                      className={styles.coatOfArmsImage}
                    />
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Box>
    </>
  )
}
