import {
  ArrowLink,
  Box,
  Column,
  Columns,
  Divider,
  GridContainer,
  Logo,
  Text,
} from '@island.is/island-ui/core'
import { SGLogo } from '../svg/index'

import * as styles from './Footer.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerColor}>
        <GridContainer>
          <Box paddingY={6}>
            <Columns collapseBelow="lg" space={6} alignY="center">
              <Column width="3/12">
                <SGLogo />
              </Column>
              <Column width="1/12">
                <div className={styles.verticalLine}>
                  <Divider />
                </div>
              </Column>
              <Column width="3/12">
                <Logo width={231} />
              </Column>
              <Column width="1/12">
                <div className={styles.verticalLine}>
                  <Divider />
                </div>
              </Column>
              <Column width="4/12">
                <Box display="flex" flexDirection="column">
                  <Box>
                    <Text variant="small">
                      Hér er á einum stað hægt að finna öll mál ráðuneyta sem
                      birt hafa verið til samráðs við almenning. Öllum er
                      frjálst að senda inn umsögn eða ábendingu.
                    </Text>
                  </Box>
                  <Box
                    paddingTop={1}
                    display="flex"
                    flexDirection="row"
                    justifyContent="spaceBetween"
                  >
                    <ArrowLink href="/um">Lesa meira</ArrowLink>
                    <ArrowLink href="mailto:samradsgatt@stjornarradid.is">
                      Senda ábendingu til samráðsgáttar
                    </ArrowLink>
                  </Box>
                </Box>
              </Column>
            </Columns>
          </Box>
        </GridContainer>
      </div>
    </footer>
  )
}

export default Footer
