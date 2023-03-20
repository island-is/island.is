import {
  ArrowLink,
  Box,
  Column,
  Columns,
  Divider,
  GridContainer,
  LinkV2,
  Logo,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SGLogo } from '../svg/index'

import * as styles from './Footer.css'

const FooterLink = ({ href = '#', children }) => {
  return (
    <Column>
      <LinkV2 href={href} color="blue600" underline="small">
        <div style={{ fontWeight: '300' }}>{children}</div>
      </LinkV2>
    </Column>
  )
}

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
      <div className={styles.footerTransparent}>
        <GridContainer>
          <Box paddingY={6}>
            <Stack space={2}>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <Column>
                  <Text variant="eyebrow" color="blue400">
                    Aðrir opinberir vefir
                  </Text>
                </Column>
              </Columns>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <FooterLink href="https://www.heilsuvera.is/">
                  Heilsuvera
                </FooterLink>
                <FooterLink href="https://island.is/mannanofn">
                  Mannanöfn
                </FooterLink>
                <FooterLink href="https://www.stjornarradid.is/verkefni/rekstur-og-eignir-rikisins/opinber-nyskopun/">
                  Opinber nýsköpun
                </FooterLink>
                <FooterLink href="http://www.opnirreikningar.is/">
                  Opnir reikningar ríkisins
                </FooterLink>
              </Columns>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <FooterLink href="https://samradsgatt.island.is/">
                  Samráðsgátt
                </FooterLink>
                <FooterLink href="https://island.is/undirskriftalistar-stofna-nyjan-lista/">
                  Undirskriftarlistar
                </FooterLink>
                <FooterLink href="https://opingogn.is/">Opin gögn</FooterLink>
                <FooterLink href="https://tekjusagan.is/">
                  Tekjusagan
                </FooterLink>
              </Columns>
            </Stack>
          </Box>
        </GridContainer>
      </div>
    </footer>
  )
}

export default Footer
